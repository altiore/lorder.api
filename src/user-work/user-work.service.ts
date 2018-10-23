import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';

import { PaginationDto } from '../@common/dto/pagination.dto';
import { Project } from '../@orm/project';
import { TaskRepository } from '../@orm/task';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { UserWork, UserWorkRepository } from '../@orm/user-work';
import { ProjectService } from '../project/project.service';
import { UserWorkCreateDto } from './dto';

@Injectable()
export class UserWorkService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserWorkRepository) private readonly userWorkRepo: UserWorkRepository,
    private readonly projectService: ProjectService
  ) {}

  public findAll(pagesDto: PaginationDto, user: User): Promise<UserWork[]> {
    return this.userWorkRepo.findAllWithPagination(pagesDto, user);
  }

  public async findOneByUserAndCheckAccess(
    userWorkId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<UserWork> {
    const userWork = await this.userWorkRepo.findOneByUser(userWorkId, user);
    if (!userWork) {
      throw new ForbiddenException('Задача не найдена');
    }
    const project = await this.projectService.findOneByMember(userWork.projectId, user);
    if (!project || !project.isAccess(accessLevel)) {
      throw new ForbiddenException('У вас нет доступа к проекту, к которому принадлежит эта задача');
    }
    return userWork;
  }

  public async start(project: DeepPartial<Project>, user: User, userWorkData: UserWorkCreateDto): Promise<UserWork> {
    let task;
    if (userWorkData.taskId) {
      task = await this.taskRepo.findOneByProjectId(userWorkData.taskId, project.id);
      if (!task) {
        throw new NotFoundException(`Указанная задача ${userWorkData.taskId} не найдена в проекте ${project.title}`);
      }
    }
    if (!task) {
      task = await this.taskRepo.createByProjectId(
        {
          description: userWorkData.description || '',
          title: userWorkData.title,
          users: [user],
        },
        project.id
      );
    }
    return this.userWorkRepo.startTask(task, user, {
      description: userWorkData.description,
    });
  }

  public async stop(userWork: UserWork): Promise<UserWork> {
    if (userWork.finishAt) {
      throw new NotAcceptableException('Эта задача уже завершена. Вы не можете завершить одну и ту же задачу дважды');
    }
    return this.userWorkRepo.finishTask(userWork);
  }

  public remove(userWork: UserWork): Promise<UserWork> {
    return this.userWorkRepo.remove(userWork);
  }
}
