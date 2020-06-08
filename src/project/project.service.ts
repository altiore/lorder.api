import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { get, pick } from 'lodash';
import * as moment from 'moment';

import { Project, ProjectDto, ProjectRepository } from '@orm/project';
import { ProjectPub, ProjectPubRepository } from '@orm/project-pub';
import { Task, TASK_SIMPLE_STATUS } from '@orm/task';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject, UserProjectRepository } from '@orm/user-project';

import { ProjectPaginationDto } from './@dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectPubRepository) private readonly projectPubRepo: ProjectPubRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository
  ) {}

  public async findOneBySuperAdmin(id: number): Promise<Project> {
    const project = await this.projectRepo.findOneByProjectId(id);
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    return project;
  }

  public async findOneByMember(projectId: number, user: User, manager?: EntityManager): Promise<Project> {
    const curManager = manager || this.projectRepo.manager;
    try {
      // 1. check user access
      const access = await curManager.findOne(UserProject, {
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
      const project = await curManager.findOne(Project, {
        relations: ['pub'],
        where: { id: projectId },
      });
      project.accessLevel = pick(access, UserProject.simpleFields);
      return project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async create(data: ProjectDto, user: User, manager?: EntityManager): Promise<Project> {
    const curManager = manager || this.projectRepo.manager;
    const project = await this.projectRepo.createByUser(data, user, curManager);
    await this.userProjectRepo.addToProject(project, user, user, ACCESS_LEVEL.VIOLET, curManager);
    return project;
  }

  public async update(project: Project, data: ProjectDto, user: User): Promise<Project> {
    await this.projectRepo.update({ id: project.id }, data);
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
    return this.projectRepo.merge(project, data);
  }

  public async remove(id: number, force: boolean = false): Promise<number> {
    if (force) {
      await this.projectRepo.manager.delete(Task, { projectId: id });
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
   *
   * SELECT
   *   SUM("task"."value"*"user_tasks"."benefitPart") as "benefitPart"
   * FROM
   *   "user_tasks"
   * LEFT JOIN
   *   "task" ON "task"."id"="user_tasks"."taskId"
   * WHERE
   *  "userId"=1
   *   AND "task"."projectId" = 53;
   *
   * SELECT
   *   SUM("task"."value") as "projectBenefit"
   * FROM
   *   "task"
   * WHERE "task"."projectId" = 53;
   */
  public async calculateUserStatistic(
    user: User,
    projectId: number = 0,
    entityManager?: EntityManager
  ): Promise<{ [key: number]: { timeSum: number; valueSum: number } }> {
    const manager = entityManager || this.projectRepo.manager;

    const step = 4;
    let i = 0;
    let userTasksPortion;
    const projectTimeSums: { [key: number]: { timeSum: number; valueSum: number } } = {};

    // Удалить статистику для задачи, в которой нет работы
    await manager.query(
      `DELETE FROM "user_tasks"
              WHERE
                "user_tasks"."userId"=${user.id}
                AND (
                  SELECT COUNT("id")
                  FROM "user_work"
                  WHERE
                    "userId"="user_tasks"."userId"
                    AND "taskId"="user_tasks"."taskId") = 0`
    );

    await manager.query(
      `UPDATE "user_tasks"
              SET "time"=((
                SELECT SUM(EXTRACT('epoch' from "user_work"."finishAt") - EXTRACT('epoch' from "user_work"."startAt"))
                  FROM "user_work"
                WHERE "userId"="user_tasks"."userId"
                  AND "taskId"="user_tasks"."taskId")*1000) WHERE "user_tasks"."userId"=${user.id}`
    );

    do {
      // TODO: userProject должен хранить последний зафиксированный элемент,
      //  чтоб можно было пересчитывать только последнюю измененную часть
      userTasksPortion = await manager
        .createQueryBuilder()
        .select('user_tasks.userId')
        .addSelect('user_tasks.taskId')
        .addSelect('user_tasks.benefitPart')
        .from('user_tasks', 'user_tasks')
        .leftJoinAndMapOne('user_tasks.task', 'task', 'task', 'user_tasks.taskId=task.id')
        .leftJoinAndMapMany(
          'task.userWorks',
          'user_work',
          'userWorks',
          '"user_tasks"."taskId"="userWorks"."taskId" AND "user_tasks"."userId"="userWorks"."userId"'
        )
        .where('"user_tasks"."userId" = :userId', { userId: user.id })
        .andWhere('"task"."projectId" = :projectId', { projectId })
        .take(step)
        .skip(i * step)
        .getMany();

      if (!userTasksPortion || !userTasksPortion.length) {
        break;
      }

      userTasksPortion.map(userT => {
        projectTimeSums[userT.task.projectId] = {
          timeSum: get(projectTimeSums, [userT.task.projectId, 'timeSum'], 0) || 0,
          valueSum:
            (get(projectTimeSums, [userT.task.projectId, 'valueSum'], 0) || 0) + userT.benefitPart * userT.task.value,
        };
        userT.task.userWorks.map(uw => {
          projectTimeSums[userT.task.projectId] = {
            timeSum:
              (get(projectTimeSums, [userT.task.projectId, 'timeSum'], 0) || 0) +
              moment(uw.finishAt).diff(moment(uw.startAt)),
            valueSum: get(projectTimeSums, [userT.task.projectId, 'valueSum'], 0),
          };
        });
      });
      i++;
    } while (userTasksPortion.length === step);

    for (const prId of Object.keys(projectTimeSums)) {
      await manager.update(
        UserProject,
        { projectId: prId, memberId: user.id },
        {
          timeSum: projectTimeSums[prId].timeSum,
          valueSum: projectTimeSums[prId].valueSum,
        }
      );
    }

    return projectTimeSums;
  }

  /**
   * TODO: logic must be more complicated because of can be huge amount of data
   */
  public async updateStatistic(project: Project): Promise<UserProject[]> {
    try {
      const projectWithMembers = await this.projectRepo.findOne({
        relations: ['members', 'pub'],
        where: { id: project.id },
      });

      for (const member of projectWithMembers.members) {
        await this.calculateUserStatistic(member.member, project.id);
      }

      const manager = this.projectRepo.manager;
      // 1. Посчитать скорость выполнения проекта в задачах, поинтах, расходуемых часах
      // TODO: находить динамически статус завершенных задач из стратегии подсчета статистики проекта
      const finishedStatus = TASK_SIMPLE_STATUS.DONE;
      const [{ count }] = await manager.query(`
        SELECT
          COUNT(*)
        FROM
          "task"
        WHERE
          "projectId"=${project.id}
           AND "status"=${finishedStatus}
           AND "isArchived"=false 
      `);
      const [{ developed_seconds, members_count }] = await manager.query(`
        SELECT
          EXTRACT('epoch' from NOW() - "project"."createdAt") as developed_seconds,
          COUNT("user_project"."memberId") as members_count
        FROM
          "project"
        LEFT JOIN "user_project" ON "user_project"."projectId"="project"."id"
        WHERE
            "project"."id"=${project.id}
            AND "user_project"."accessLevel">0
        GROUP BY "project"."createdAt"
      `);
      const [{ timeSum, valueSum }] = await manager.query(`
        SELECT
          SUM("user_project"."timeSum") as "timeSum",
          SUM("user_project"."valueSum") as "valueSum"
        FROM
          "user_project"
        WHERE
          "user_project"."projectId"=${project.id};
      `);
      const developedDays = Math.ceil(developed_seconds / 86400);
      const developedMonths = Math.ceil(developedDays / 30.4375);
      const days8hours = Math.round((timeSum * 100) / 20571000) / 100;

      if (projectWithMembers.pub) {
        await this.projectPubRepo.update(
          { uuid: projectWithMembers.pub.uuid },
          {
            statistic: {
              metrics: {
                membersTimeProductivity: Math.floor((days8hours * 10000) / developedDays / members_count) / 10000,
                developedDays,
                developedMonths,
                membersCount: parseInt(members_count, 0),
                tasksCount: parseInt(count, 0),
                timeSumIn8hoursDays: days8hours,
                value: valueSum,
              },
            },
          }
        );
      }

      return await this.userProjectRepo.find({ where: { project } });
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
