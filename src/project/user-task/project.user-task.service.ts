import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';

import { Project } from '../../@orm/project';
import { TaskRepository } from '../../@orm/task';
import { User } from '../../@orm/user';
import { UserTask, UserTaskRepository } from '../../@orm/user-task';
import { UserTaskCreateDto } from './dto';

@Injectable()
export class ProjectUserTaskService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserTaskRepository) private readonly userTaskRepo: UserTaskRepository
  ) {}

  public findAll(user: User): Promise<UserTask[]> {
    return this.userTaskRepo.findAllByUser(user);
  }

  public async start(project: DeepPartial<Project>, user: User, userTaskData: UserTaskCreateDto): Promise<UserTask> {
    let task;
    let currentlyCreated = false;
    if (userTaskData.taskId) {
      task = await this.taskRepo.findOneByProjectId(userTaskData.taskId, project.id);
      if (!task) {
        throw new NotFoundException(`Указанная задача ${userTaskData.taskId} не найдена в проекте ${project.title}`);
      }
    }
    if (!task) {
      currentlyCreated = true;
      task = await this.taskRepo.createByProjectId(
        {
          description: '',
          title: userTaskData.title,
        },
        project.id
      );
    }
    return this.userTaskRepo.startTask(task, user, {
      description: userTaskData.description || `${userTaskData.title}${currentlyCreated ? ' 1' : ' 2'}`,
    });
  }

  public async remove(taskId: number, user: User): Promise<UserTask | false> {
    const task = await this.userTaskRepo.findOne({ user, id: taskId });
    if (!task) {
      return false;
    }
    await this.userTaskRepo.remove(task);
    return task;
  }
}
