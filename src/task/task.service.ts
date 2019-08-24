import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task, TaskRepository } from '../@orm/task';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { ProjectService } from '../project/project.service';
import { TaskPagination } from './dto';

@Injectable()
export class TaskService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository
  ) {}

  public async findAll(pagesDto: TaskPagination, user: User): Promise<Task[]> {
    console.log('TaskService.findAll:before', process.memoryUsage());
    const res = await this.taskRepo.findAllWithPagination(pagesDto, user);
    console.log('TaskService.findAll:after', process.memoryUsage());
    return res;
  }

  public async findOne(taskId: number, user: User): Promise<Task> {
    console.log('TaskService.findOne:before', process.memoryUsage());
    const task = await this.taskRepo.findOne({
      relations: ['performer', 'userWorks', 'users'],
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user);
    if (!task.project || !task.project.isAccess(ACCESS_LEVEL.RED)) {
      throw new ForbiddenException('Доступ к этой задаче запрещен');
    }
    task.children = await this.taskRepo.findDescendants(task);
    console.log('TaskService.findOne:before', process.memoryUsage());
    return task;
  }

  public async archive(id: number, user: User): Promise<Task | false> {
    const task = await this.taskRepo.findOne({
      where: {
        id,
        isArchived: false,
      },
    });

    if (!task) {
      throw new NotFoundException(
        'Задача не найдена. Возмжоно вы пытаетесь заархивировать уже заархивированную задачу'
      );
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user);
    if (!task.project || !task.project.isAccess(ACCESS_LEVEL.YELLOW)) {
      throw new ForbiddenException(
        'Архивировать задачи могут пользователи начиная с Желтого уровня'
      );
    }

    task.isArchived = true;

    await this.taskRepo.save(task);

    return task;
  }
}
