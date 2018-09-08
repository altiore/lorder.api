import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { EmailDto, IdDto, User } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    private readonly authService: AuthService
  ) {}

  public findAll(user: User): Promise<Partial<Project>[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public async findOne(id: number, user: User): Promise<Project> {
    try {
      return (await this.projectRepo.findOneByOwner(id, user)) as Project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }

  public async addTaskType(project: Project, taskTypeId: number): Promise<any> {
    const taskType = await this.taskTypeRepo.findOne(taskTypeId);
    if (!taskType) {
      throw new NotFoundException('Тип задачи не был найден');
    }
    return this.projectTaskTypeRepo.addToProject(project, taskType);
  }

  public async removeFromProject(project: Project, taskTypeId: number): Promise<DeleteResult> {
    const taskType = await this.taskTypeRepo.findOne(taskTypeId);
    if (!taskType) {
      throw new NotFoundException('Тип задачи не был найден');
    }
    return this.projectTaskTypeRepo.removeFromProject(project, taskType);
  }

  public async update(project: Project, taskTypesIds: number[]): Promise<any> {
    const taskTypes = await this.taskTypeRepo.findByIds(taskTypesIds);
    if (taskTypes.length !== taskTypesIds.length) {
      throw new NotAcceptableException(
        'Недопустимый id taskType был передан.' + ' Пожалуйста, убедитесь, что все сущности были созданы предварительно'
      );
    }
    try {
      return await this.projectTaskTypeRepo.createMultiple(project, taskTypes);
    } catch (e) {
      return 'error';
    }
  }

  public async invite(project: Project, invite: EmailDto, hostWithProtocol: string, inviter: User): Promise<User> {
    const query = `project=${project.id}`;
    const member = (await this.authService.sendMagicLink(invite, hostWithProtocol, query, true)) as User;
    await this.userProjectRepo.addToProject(project, member, inviter);
    return member;
  }

  public async removeMemberFromProject({ id }: IdDto, project: Project): Promise<boolean> {
    await this.userProjectRepo.delete({ member: { id }, project });
    return true;
  }
}
