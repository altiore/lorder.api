import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';

import { Project } from '../../@orm/project';
import { TaskRepository } from '../../@orm/task';
import { User } from '../../@orm/user';
import { UserWork, UserWorkRepository } from '../../@orm/user-work';
import { UserWorkCreateDto } from './dto';

@Injectable()
export class ProjectUserWorkService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserWorkRepository) private readonly userWorkRepo: UserWorkRepository
  ) {}

  public findAll(user: User): Promise<UserWork[]> {
    return this.userWorkRepo.findAllByUser(user);
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
          description: '',
          title: userWorkData.title,
        },
        project.id
      );
    }
    return this.userWorkRepo.startTask(task, user, {
      description: userWorkData.description,
    });
  }

  public async stop(project: DeepPartial<Project>, user: User, userWorkId: number): Promise<UserWork> {
    let userWork;
    userWork = await this.userWorkRepo.findOne({ user, id: userWorkId });
    if (!userWork) {
      throw new NotFoundException('Задача не найдена');
    }
    if (userWork.finishAt) {
      throw new NotAcceptableException('Эта задача уже завершена. Вы не можете завершить одну и ту же задачу дважды');
    }
    return this.userWorkRepo.finishTask(userWork);
  }

  public async remove(userWorkId: number, user: User): Promise<UserWork | false> {
    const task = await this.userWorkRepo.findOne({ user, id: userWorkId });
    if (!task) {
      return false;
    }
    await this.userWorkRepo.remove(task);
    return task;
  }
}
