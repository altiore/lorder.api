import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@orm/project';
import { EmailDto, User, UserRepository } from '@orm/user';
import { UserProject, UserProjectRepository } from '@orm/user-project';
import { AuthService } from 'auth/auth.service';
import { ValidationError } from 'class-validator';
import * as moment from 'moment';
import { DeepPartial, EntityManager } from 'typeorm';

import { IdDto } from '../../@common/dto';
import { ValidationException } from '../../@common/exceptions/validation.exception';
import { UserWork } from '../../@orm/user-work';
import { ProjectRoleService } from '../role/project-role.service';

import { RequestMembership } from './dto/request.membership';
import { UserProjectUpdateDto } from './dto/user-project.update.dto';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly projectRoleService: ProjectRoleService
  ) {}

  public async findMember(id: number, project: Project): Promise<UserProject> {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userProjectRepo.findOne({
      relations: ['project', 'member'],
      where: { member: user, project },
    });
  }

  public async updateMember(memberId: number, project: Project, data: UserProjectUpdateDto): Promise<UserProject> {
    const member = await this.findMember(memberId, project);
    if (!member) {
      throw new NotFoundException('Member not found in this project');
    }
    if (typeof data.accessLevel !== 'undefined') {
      member.accessLevel = data.accessLevel;
    }
    if (typeof data.roles !== 'undefined' && data.roles.length) {
      member.roles = await this.projectRoleService.findByRoles(data.roles, project);
    }
    return await this.userProjectRepo.save(member);
  }

  public async invite(
    project: DeepPartial<Project>,
    invite: EmailDto,
    hostWithProtocol: string,
    inviter: User
  ): Promise<UserProject> {
    const query = `project=${project.id}`;
    const member = (await this.authService.sendMagicLink(invite, hostWithProtocol, query, true)) as User;
    return await this.userProjectRepo.addToProject(project, member, inviter);
  }

  public async removeMemberFromProject({ id }: IdDto, project: DeepPartial<Project>): Promise<boolean> {
    await this.userProjectRepo.delete({ member: { id }, project: { id: project.id } });
    return true;
  }

  public async acceptInvitation(user: User, project: DeepPartial<Project>): Promise<UserProject> {
    const userProject = await this.userProjectRepo.findOne({
      where: {
        member: user,
        project,
      },
    });
    if (!userProject) {
      throw new NotAcceptableException('Приглашение было отозвано');
    }
    return await this.userProjectRepo.activateInProject(user, project);
  }

  public getAllByProject(project: Project, user: User): Promise<UserProject[]> {
    return this.userProjectRepo.findWithStatistic(project);
  }

  public async addTime(userWork: UserWork, entityManager?: EntityManager): Promise<UserProject> {
    const manager = entityManager || this.userProjectRepo.manager;
    if (typeof userWork.projectId !== 'number') {
      throw new NotAcceptableException(
        'Можно добавить время только в работу пользователя, привязанную к задаче проекта'
      );
    }
    const userProject = await manager.findOne(UserProject, {
      member: { id: userWork.userId } as User,
      project: { id: userWork.projectId } as Project,
    });

    if (!userProject) {
      throw new NotFoundException('Проект пользователя не был найден!');
    }

    if (!userWork.finishAt || !userWork.startAt) {
      throw new NotAcceptableException('Начало или конец не заданны');
    }

    const addedTimeSum = moment(userWork.finishAt).diff(moment(userWork.startAt));
    userProject.timeSum = userProject.timeSum + addedTimeSum;
    userProject.valueSum =
      userWork.task.value && userWork.task.userTasks.length
        ? userWork.task.value / userWork.task.userTasks.length + userProject.valueSum
        : userProject.valueSum;
    const curUserTask = userWork.task.userTasks.find(el => el.userId === userWork.projectId);
    if (curUserTask) {
      curUserTask.time += addedTimeSum;
      await manager.save(curUserTask);
    }
    return await manager.save(userProject);
  }

  public async requestMembership(user: User, projectId: number, data: RequestMembership): Promise<UserProject> {
    const member = await this.findMember(user.id, { id: projectId } as Project);
    if (!member) {
      const roles = await this.projectRoleService.findByRoles([data.role], { id: projectId } as Project);
      if (roles && roles.length) {
        const newMember = this.userProjectRepo.create({
          accessLevel: -1,
          member: user,
          projectId,
        });
        return await this.userProjectRepo.save(newMember);
      }

      // TODO: по-умолчанию, предлагать роль, указанную в проекте, как роль для старта по-умолчанию
      throw new ValidationException([
        Object.assign(new ValidationError(), {
          constraints: {
            isNotExists: 'Запрошеная роль в проекте не существует',
          },
          property: 'role',
          value: data.role,
        }),
      ]);
    }

    throw new NotAcceptableException(
      'Вы уже являетесь участником проекта или уже отсылали запрос и он все еще на рассмотрении'
    );
  }
}
