import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { get, pick } from 'lodash';
import * as moment from 'moment';

import { Project, ProjectDto, ProjectRepository } from '@orm/project';
import { ProjectPub, ProjectPubRepository } from '@orm/project-pub';
import { TaskRepository } from '@orm/task';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject, UserProjectRepository } from '@orm/user-project';

import { UserWork } from '../@orm/user-work';

import { ProjectPaginationDto } from './@dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectPubRepository) private readonly projectPubRepo: ProjectPubRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository
  ) {}

  public async findOneBySuperAdmin(id: number): Promise<Project> {
    const project = await this.projectRepo.findOneByProjectId(id);
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    return project;
  }

  public async findOneByMember(projectId: number, user: User): Promise<Project> {
    try {
      // 1. check user access
      const access = await this.userProjectRepo.findOne({
        where: {
          member: { id: user.id },
          project: { id: projectId },
        },
      });
      if (!(get(access, 'accessLevel') >= ACCESS_LEVEL.WHITE)) {
        throw new ForbiddenException(
          'Пользователь не может просматритьва подробную информацию' +
            ' об этом проекте. Пожалуйста подайте заявку на получение доступа!'
        );
      }
      // 2. load project if has correct access to it
      const project = await this.projectRepo.findOneByProjectId(projectId);
      project.accessLevel = pick(access, UserProject.simpleFields);
      return project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async create(data: ProjectDto, user: User): Promise<Project> {
    const project = await this.projectRepo.createByUser(data, user);
    await this.userProjectRepo.addToProject(project, user, user, ACCESS_LEVEL.VIOLET);
    return project;
  }

  public async update(project: Project, data: ProjectDto, user: User): Promise<Project> {
    if (data.title) {
      project.title = data.title;
    }
    if (typeof data.monthlyBudget === 'number') {
      project.monthlyBudget = data.monthlyBudget;
    }
    await this.projectRepo.update(
      { id: project.id },
      {
        title: project.title,
        monthlyBudget: project.monthlyBudget,
      }
    );
    // TODO: разобраться, нужны ли разные названия для публичного и не публичного проектов?
    if (project.pub) {
      await this.projectPubRepo.update(
        {
          uuid: project.pub.uuid,
        },
        {
          title: project.title,
        }
      );
    }
    return project;
  }

  public async remove(id: number, force: boolean = false): Promise<number> {
    if (force) {
      await this.taskRepo.delete({ projectId: id });
    }
    await this.projectRepo.delete(id);
    return id;
  }

  public async findAllParticipantByUser(
    pagesDto: ProjectPaginationDto,
    user: User,
    minimumAccessLevel?: ACCESS_LEVEL
  ): Promise<UserProject[]> {
    return await this.userProjectRepo.findAllParticipantProjects(pagesDto, user, minimumAccessLevel);
  }

  public async findAllBySuperAdmin(pagesDto: ProjectPaginationDto): Promise<Project[]> {
    return this.projectRepo.findAllWithPagination(pagesDto);
  }

  public async findPublishedByUuid(uuid: string): Promise<ProjectPub> {
    return await this.projectPubRepo.findPublishedByUuid(uuid);
  }

  public async publish(project: Project): Promise<Project> {
    if (await this.projectPubRepo.findPublishedByProject(project)) {
      throw new NotAcceptableException('Этот проект уже опубликован!');
    }
    await this.projectPubRepo.publishNew(project);
    return project;
  }

  /**
   * считаем как для всех проектов (если projectId = 0), так и для одного проекта.
   * Для всех проектов нужно пересчитать, если работа пользователя изменилась. В этом случае могут быть затронуты
   * другие проекты и пересчитать нужно все.
   * Один проект считаем, когда нужно обновить информацию для проекта
   */
  public async calculateUserStatistic(
    user: User,
    projectId: number = 0,
    entityManager?: EntityManager
  ): Promise<{ [key: number]: { timeSum: number; valueSum: number } }> {
    const manager = entityManager || this.projectRepo.manager;

    const step = 10;
    let i = 0;
    let userWorkPortion;
    const projectTimeSums: { [key: number]: { timeSum: number; valueSum: number } } = {};

    do {
      // TODO: userProject должен хранить последний зафиксированный элемент, чтоб можно было пересчитывать только
      // последнюю измененную часть
      const where: any = { member: user };
      if (projectId) {
        where.project = { id: projectId };
      }
      userWorkPortion = await manager.find(UserWork, {
        relations: ['task', 'task.users'],
        skip: i * step,
        take: step,
        where,
      });
      if (!userWorkPortion || !userWorkPortion.length) {
        break;
      }

      userWorkPortion.map((uw: UserWork) => {
        projectTimeSums[uw.task.projectId] = {
          timeSum:
            (get(projectTimeSums, [uw.task.projectId, 'timeSum'], 0) || 0) +
            moment(uw.finishAt).diff(moment(uw.startAt)),
          valueSum: Math.round((100 * (uw.task.value || 0)) / uw.task.users.length) / 100,
        };
      });
      i++;
    } while (userWorkPortion.length === step);

    await Promise.all(
      Object.keys(projectTimeSums).map(async prId => {
        await manager.update(
          UserProject,
          { projectId: prId, memberId: user.id },
          {
            timeSum: projectTimeSums[prId].timeSum > 0 ? projectTimeSums[prId].timeSum : 0,
            valueSum: projectTimeSums[prId].valueSum > 0 ? projectTimeSums[prId].valueSum : 0,
          }
        );
      })
    );

    return projectTimeSums;
  }

  /**
   * TODO: logic must be more complicated because of can be huge amount of data
   */
  public async updateStatistic(
    project: Project
  ): Promise<{
    data: { [key: number]: { value: number; time: number } };
    members: Array<{
      accessLevel: ACCESS_LEVEL;
      avatar?: string;
      email: string;
      id: number;
    }>;
  }> {
    try {
      const projectWithMembers = await this.projectRepo.findOne({
        relations: ['members', 'pub'],
        where: { id: project.id },
      });

      const data: { [key: number]: { value: number; time: number } } = {};
      await Promise.all(
        projectWithMembers.members.map(async member => {
          const stats = await this.calculateUserStatistic(member.member, project.id);
          data[member.member.id] = {
            time: get(stats, [project.id, 'timeSum'], 0),
            value: get(stats, [project.id, 'valueSum'], 0),
          };
          return stats;
        })
      );

      const statistic = {
        data,
        members: projectWithMembers.members.map(member => ({
          accessLevel: member.accessLevel,
          avatar: member.member.avatarUrl,
          email: member.member.displayName || member.member.email,
          id: member.member.id,
        })),
      };
      if (projectWithMembers.pub) {
        await this.projectPubRepo.update(
          { project: projectWithMembers },
          {
            statistic,
          }
        );
      }

      return statistic;
    } catch (e) {
      throw e;
    }
  }

  async findProjectDetails(project: Project): Promise<Project> {
    const p = await this.projectRepo.findOne({
      relations: [
        'defaultTaskType',
        'members',
        'members.roles',
        'members.roles.role',
        'projectTaskTypes',
        'pub',
        'roles',
      ],
      where: { id: project.id },
    });
    p.accessLevel = project.accessLevel;
    return p;
  }
}
