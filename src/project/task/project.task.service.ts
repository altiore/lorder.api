import { PaginationDto } from '@common/dto';
import { ValidationException } from '@common/exceptions/validation.exception';
import { ForbiddenException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@orm/project';
import { ProjectTaskType, ProjectTaskTypeRepository } from '@orm/project-task-type';
import { Task } from '@orm/task';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject } from '@orm/user-project';
import { ValidationError } from 'class-validator';
import { omit } from 'lodash';
import { TaskService } from 'task/task.service';
import { EntityManager } from 'typeorm';

import { TaskType } from '../../@orm/task-type/task-type.entity';

import { TaskCreateDto, TaskMoveDto, TaskUpdateDto } from './dto';
import { TaskListDto } from './dto/task.list.dto';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
    private readonly taskService: TaskService
  ) {}

  public async findAll(pagesDto: PaginationDto, projectId: number, user: User): Promise<TaskListDto> {
    const res = await this.taskService.findAllByProject(pagesDto, projectId);

    // TODO: добавлять колонки в зависимости от стратегии перемещения задач
    const access = await this.projectTaskTypeRepo.manager.findOne(UserProject, {
      relations: ['roles', 'roles.role', 'roles.allowedMoves', 'roles.allowedMoves.from', 'roles.allowedMoves.to'],
      where: {
        member: { id: user.id },
        project: { id: projectId },
      },
    });
    let columns = [];
    if (access && access.roles) {
      const allowedMoves = access.roles.reduce((arr, cur) => {
        arr = arr.concat(
          cur.allowedMoves.map(am => ({
            title: cur.role.id + '_' + am.type,
            ...am,
          }))
        );
        return arr;
      }, []);
      columns = allowedMoves.reduce((arr, am) => {
        const fromIndex = arr.findIndex(el => el.id === am.fromId);
        const toIndex = arr.findIndex(el => el.id === am.toId);
        const preparedAm = omit(am, ['from', 'to']);
        if (fromIndex === -1) {
          if (toIndex === -1) {
            arr.push({
              ...am.to,
              moves: [preparedAm],
            });
            arr.push({
              ...am.from,
              moves: [preparedAm],
            });
          } else {
            arr[toIndex].moves.push(preparedAm);
          }
        } else {
          if (toIndex === -1) {
            arr[fromIndex].moves.push(preparedAm);
          } else {
            arr[fromIndex].moves.push(preparedAm);
            arr[toIndex].moves.push(preparedAm);
          }
        }
        return arr;
      }, []);
    }
    return { ...res, columns };
  }

  public findOne(sequenceNumber: number, projectId: number): Promise<Task> {
    return this.taskService.findOneBySequenceNumber(sequenceNumber, projectId);
  }

  public async create(taskCreateDto: TaskCreateDto, project: Project, user: User): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskCreateDto, project.id);
    return await this.taskService.createByProject(preparedData, project, user);
  }

  public async update(
    sequenceNumber: number,
    taskUpdateDto: TaskUpdateDto,
    project: Project,
    user: User
  ): Promise<Task> {
    // 1. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(sequenceNumber, project, user, ACCESS_LEVEL.YELLOW);

    // 2. Проверить, что задача может быть изменена (Законченная или заархивированная задача не может быть изменена)
    this.checkCanBeEdit(checkedTask);

    // 3. Подготовить данные для обновления задачи
    const preparedData = await this.parseTaskDtoToTaskObj(taskUpdateDto, project.id);

    // 4. Обновить задачу
    return await this.taskService.updateByUser(checkedTask, preparedData, user);
  }

  public async move(sequenceNumber: number, project: Project, user: User, taskMoveDto: TaskMoveDto): Promise<Task> {
    // 1. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(sequenceNumber, project, user);
    // 2. TODO: проверить разрешенное перемещение задачи для данного статуса
    // 3. TODO: проверить разрешенное перемещение задачи для данного пользователя
    // 4. Обновить и вернуть обновленную задачу
    return this.taskService.updateByUser(checkedTask, taskMoveDto, user);
  }

  public async delete(sequenceNumber: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(sequenceNumber, projectId);
    if (!task) {
      return false;
    }
    await this.taskService.deleteBySequenceNumber(sequenceNumber, projectId);
    return task;
  }

  public async checkAccess(
    sequenceNumber: number,
    project: Project,
    user: User,
    statusLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<Task> {
    const checkedTask = await this.taskService.findOne(sequenceNumber, project, user);
    if (project.accessLevel.accessLevel < statusLevel) {
      if (checkedTask.performerId !== user.id) {
        throw new ForbiddenException({
          message: 'У вас нет доступа к этой задаче',
          task: checkedTask,
        });
      }
    }
    return checkedTask;
  }

  private async parseTaskDtoToTaskObj(
    taskDto: TaskCreateDto | TaskUpdateDto,
    projectId: number,
    manager?: EntityManager
  ): Promise<Partial<Task>> {
    const curManager = manager || this.projectTaskTypeRepo.manager;
    const preparedData: Partial<Task> = {};
    if (taskDto.projectParts) {
      const foundParts = taskDto.projectParts.length
        ? await this.taskService.findProjectParts(taskDto.projectParts, projectId, curManager)
        : [];
      if (foundParts.length !== taskDto.projectParts.length) {
        throw new ValidationException([
          Object.assign(new ValidationError(), {
            constraints: {
              isInvalid: 'Указаны неверные части проекта',
            },
            property: 'projectParts',
            value: taskDto.projectParts,
          }),
        ]);
      }
      preparedData.projectParts = foundParts;
    }
    if (taskDto.description !== undefined) {
      preparedData.description = taskDto.description;
    }
    if (taskDto.title !== undefined) {
      preparedData.title = taskDto.title;
    }
    if (taskDto.value !== undefined) {
      preparedData.value = taskDto.value;
    }
    if (taskDto.source !== undefined) {
      preparedData.source = taskDto.source;
    }
    if (taskDto.status !== undefined) {
      preparedData.status = taskDto.status;
    }
    if (taskDto.typeId !== undefined) {
      if (!taskDto.typeId) {
        preparedData.typeId = null;
      } else {
        const projectTaskType = await curManager.findOne(ProjectTaskType, {
          where: {
            project: { id: projectId },
            taskType: { id: taskDto.typeId },
          },
        });
        if (!projectTaskType) {
          throw new ValidationException(undefined, 'Тип задачи не был найдет в текущем проекте');
        }
      }
      preparedData.typeId = taskDto.typeId;
    } else {
      const taskType = await curManager.findOne(TaskType, {
        where: {
          name: 'feature',
        },
      });
      if (!taskType) {
        throw new ValidationException(undefined, 'Тип задачи "feature" не был найдет в системе');
      }
      preparedData.typeId = taskType.id;
    }
    if (taskDto.performerId !== undefined) {
      if (!taskDto.performerId) {
        preparedData.performer = null;
      } else {
        const performer = await curManager.findOne(UserProject, {
          relations: ['member'],
          where: {
            member: { id: taskDto.performerId },
            project: { id: projectId },
          },
        });
        if (!performer) {
          throw new ValidationException(undefined, 'Исполнитель не был найдет в текущем проекте');
        }
        preparedData.performer = { id: performer.member.id } as User;
      }
    }

    return preparedData;
  }

  private checkCanBeEdit(task: Task): void {
    if (task.isArchived) {
      throw new NotAcceptableException('Заархивированная задача не может быть изменена');
    }
    // TODO: проверить так же, была ли задача завершена, в соответсвии с обновленным FLOW задач
    if (task.status >= 4) {
      throw new NotAcceptableException(
        'Завершенная задача не может быть изменена! Это противоречит логике,' +
          ' ведь задача была оценена, описанная именно этим образом. Если мы изменим задачу после окончания,' +
          ' это будет означать, что мы должы изменить и ее оценку. Во избежание недоразумений,' +
          ' мы запрещаем изменять выполненные задачи.'
      );
    }
  }
}
