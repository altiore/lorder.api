import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moment } from 'moment';
import { DeepPartial } from 'typeorm';

import { PaginationDto } from '../@common/dto/pagination.dto';
import { Project } from '../@orm/project';
import { TaskRepository } from '../@orm/task';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { UserWork, UserWorkRepository } from '../@orm/user-work';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { StartResponse, StopResponse, UserWorkCreateDto, UserWorkUpdateDto } from './dto';

@Injectable()
export class UserWorkService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserWorkRepository) private readonly userWorkRepo: UserWorkRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
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

  public async finishNotFinished(user: User): Promise<UserWork[]> {
    const userWorks = await this.userWorkRepo.findNotFinishedByUser(user);
    return await this.userWorkRepo.finishTask(userWorks);
  }

  public async start(
    project: DeepPartial<Project>,
    user: User,
    userWorkData: UserWorkCreateDto
  ): Promise<StartResponse> {
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

  public async update(userWork: UserWork, userWorkDto: UserWorkUpdateDto): Promise<UserWork> {
    if (userWorkDto.duration) {
      userWork.finishAt = userWork.startAt.clone().add(userWorkDto.duration, 'seconds');
      return await this.userWorkRepo.save(userWork);
    }
    if (userWorkDto.description) {
      userWork.description = userWorkDto.description;
      return await this.userWorkRepo.save(userWork);
    }
    return userWork;
  }

  public recent(user: User, pagesDto: PaginationDto): Promise<UserWork[]> {
    return this.userWorkRepo.findWithPaginationByUser(user, pagesDto);
  }

  private async startNew(
    project: DeepPartial<Project>,
    user: User,
    userWorkData: UserWorkCreateDto,
    startAt: Moment
  ): Promise<UserWork> {
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
