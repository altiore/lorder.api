import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moment } from 'moment';
import moment = require('moment');

import { PaginationDto } from '../@common/dto/pagination.dto';
import { Project } from '../@orm/project';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { UserWork, UserWorkRepository } from '../@orm/user-work';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';

import { StartResponse, StopResponse, UserWorkCreateDto, UserWorkEditResultDto, UserWorkPatchDto } from './dto';

@Injectable()
export class UserWorkService {
  constructor(
    @InjectRepository(UserWorkRepository) private readonly userWorkRepo: UserWorkRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly taskService: TaskService
  ) {}

  public findAll(pagesDto: PaginationDto, user: User): Promise<UserWork[]> {
    return this.userWorkRepo.findAllWithPagination(pagesDto, user);
  }

  public async findOneByUser(userWorkId: number, user: User): Promise<UserWork> {
    const userWork = await this.userWorkRepo.findOneByUser(userWorkId, user);
    if (!userWork) {
      throw new ForbiddenException('Вы можете менять время только своей работы');
    }
    return userWork;
  }

  public async findOneByUserAndCheckAccess(
    userWorkId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<UserWork> {
    const userWork = await this.userWorkRepo.findOneByUser(userWorkId, user);
    if (!userWork) {
      throw new ForbiddenException('Вы пытаетесь изменить чужую работу');
    }
    const project = await this.projectService.findOneByMember(userWork.projectId, user);
    if (!project || !project.isAccess(accessLevel)) {
      throw new ForbiddenException('У вас нет доступа к проекту, к которому принадлежит эта задача');
    }
    return userWork;
  }

  public async finishNotFinished(user: User): Promise<UserWork[]> {
    const userWorks = await this.userWorkRepo.findNotFinishedByUser(user);
    return await this.userWorkRepo.finishTask(userWorks);
  }

  public async start(project: Project, user: User, userWorkData: UserWorkCreateDto): Promise<StartResponse> {
    // TODO: добавить транзакции на процесс создания всех частей задачи
    // 1. Завершить предыдущие задачи, если есть незавершенные
    const finishedUserWorks = await this.finishNotFinished(user);

    // 2. Создать новую задачу
    let startAt;
    if (finishedUserWorks && finishedUserWorks.length) {
      startAt = finishedUserWorks[0].finishAt;
    }
    const startedUserWork = await this.startNew(project, user, userWorkData, startAt);
    return {
      finished: finishedUserWorks,
      started: startedUserWork,
    };
  }

  public async stop(userWork: UserWork, user: User): Promise<StopResponse> {
    if (userWork.finishAt) {
      throw new NotAcceptableException('Эта задача уже завершена. Вы не можете завершить одну и ту же задачу дважды');
    }
    const previous = await this.userWorkRepo.finishTask(userWork);
    let defaultProject;
    if (user.defaultProjectId) {
      defaultProject = await this.projectService.findOneByMember(user.defaultProjectId, user);
    } else {
      defaultProject = await this.userService.createDefaultProject(user);
    }
    const next = await this.startNew(
      defaultProject,
      user,
      {
        description: `После "${previous.task.title}"`,
        projectId: defaultProject.id,
        title: 'Перерыв/Отдых',
      },
      previous.finishAt
    );
    return {
      next,
      previous,
    };
  }

  public remove(userWork: UserWork): Promise<UserWork> {
    return this.userWorkRepo.remove(userWork);
  }

  public async update(userWork: UserWork, userWorkDto: UserWorkPatchDto, user: User): Promise<UserWorkEditResultDto> {
    // 0. Обернуть выполнение в транзакцию
    let removed = [];
    let touched = [];
    if (userWorkDto.startAt || userWorkDto.finishAt) {
      // 1. найти все задачи, затрагивающие этот промежуток времени
      const touchedUserWorks = await this.userWorkRepo.findAllTouchedBetween(
        userWork,
        user,
        userWorkDto.startAt ? moment(userWorkDto.startAt) : userWork.startAt,
        userWorkDto.finishAt ? moment(userWorkDto.finishAt) : userWork.finishAt
      );

      // 2. удалить все задачи, полностью включенные в этот промежуток времени
      removed = touchedUserWorks.filter(
        el =>
          el.startAt.diff(userWorkDto.startAt ? moment(userWorkDto.startAt) : userWork.startAt) >= 0 &&
          (el.finishAt
            ? el.finishAt.diff(userWorkDto.finishAt ? moment(userWorkDto.finishAt) : userWork.finishAt || moment()) <= 0
            : !userWorkDto.finishAt)
      );
      if (removed.length) {
        await this.userWorkRepo.remove(removed);
      }

      // 3. изменить все задачи, которые затрагивает этот промежуток времени
      touched = touchedUserWorks.filter((tuw: any) => removed.findIndex(el => el.id === tuw.id) === -1);
      if (touched.length) {
        touched = touched.map(el => {
          if (el.startAt.diff(userWorkDto.startAt ? moment(userWorkDto.startAt) : userWork.startAt) < 0) {
            el.startAt = moment(userWorkDto.finishAt);
          } else {
            el.finishAt = moment(userWorkDto.startAt);
          }
          return el;
        });
        await this.userWorkRepo.save(touched);
      }
    }

    // 4. изменить изменяемую задачу
    const updateUserWork = this.userWorkRepo.merge(userWork, userWorkDto);
    const edited = await this.userWorkRepo.save(updateUserWork);

    return {
      edited,
      removed,
      touched,
    };
  }

  public recent(user: User, pagesDto: PaginationDto): Promise<UserWork[]> {
    return this.userWorkRepo.findWithPaginationByUser(user, pagesDto);
  }

  private async startNew(
    project: Project,
    user: User,
    userWorkData: UserWorkCreateDto,
    startAt: Moment
  ): Promise<UserWork> {
    let task;
    if (userWorkData.taskId) {
      task = await this.taskService.findOneById(userWorkData.taskId, user);
      if (!task) {
        throw new NotFoundException(`Указанная задача ${userWorkData.taskId} не найдена в проекте ${project.title}`);
      }
    }
    if (!task) {
      const taskData = {
        description: userWorkData.description || '',
        performerId: userWorkData.performerId || user.id,
        status: 2,
        title: userWorkData.title,
      };
      task = await this.taskService.createByProject(taskData, project, user);
    }
    return await this.userWorkRepo.startTask(
      task,
      user,
      {
        description: userWorkData.description,
      },
      startAt
    );
  }
}
