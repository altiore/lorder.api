import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@orm/project';
import { EmailDto, User, UserRepository } from '@orm/user';
import { UserProject, UserProjectRepository } from '@orm/user-project';
import { AuthService } from 'auth/auth.service';
import * as moment from 'moment';
import { DeepPartial, EntityManager } from 'typeorm';

import { IdDto } from '../../@common/dto';
import { UserWork } from '../../@orm/user-work';
import { ProjectRoleService } from '../role/project-role.service';

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
    return await manager.save(userProject);
  }
}
