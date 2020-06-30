import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { get, pick } from 'lodash';
import * as moment from 'moment';
import { EntityManager, In } from 'typeorm';

import { Project, ProjectDto, ProjectRepository } from '@orm/project';
import { ProjectPub, ProjectPubRepository } from '@orm/project-pub';
import { Task } from '@orm/task';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject, UserProjectRepository } from '@orm/user-project';

import {
  daysToMonths,
  millisecondsTo8hoursDays,
  secondsToDays,
  timeProductivity,
} from '@common/helpers/metricConverter';

import { IColumn, ROLE, STATUS_NAME, TASK_FLOW_STRATEGY } from '../@domains/strategy';
import { TaskFlowStrategy } from '../@domains/strategy';
import { ProjectRole } from '../@orm/project-role/project-role.entity';
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
    // обновляем стратегию в информации о задачах
    await this.changeStrategy(project, user, data.strategy);

    await this.projectRepo.update({ id: project.id }, data);
    // TODO: разобраться, нужны ли разные названия для публичного и не публичного проектов?
    if (project.pub && data.title !== project.title) {
      await this.projectPubRepo.update(
        {
          uuid: project.pub.uuid,
        },
        {
          title: project.title,
        }
      );
    }
    const updatedProject = this.projectRepo.merge(project, data);
    updatedProject.taskColumns = (await this.getCurrentUserStrategy(updatedProject, user)).columns;
    return updatedProject;
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
    project.pub = await this.projectPubRepo.publishNew(project);
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

      userTasksPortion.map((userT) => {
        projectTimeSums[userT.task.projectId] = {
          timeSum: get(projectTimeSums, [userT.task.projectId, 'timeSum'], 0) || 0,
          valueSum:
            (get(projectTimeSums, [userT.task.projectId, 'valueSum'], 0) || 0) + userT.benefitPart * userT.task.value,
        };
        userT.task.userWorks.map((uw) => {
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
      let result: UserProject[] = [];
      await this.projectRepo.manager.transaction(async (manager) => {
        const projectWithMembers = await manager.findOne(Project, {
          relations: ['members', 'pub'],
          where: { id: project.id },
        });

        for (const member of projectWithMembers.members) {
          await this.calculateUserStatistic(member.member, project.id, manager);
        }

        // 1. Посчитать скорость выполнения проекта в задачах, поинтах, расходуемых часах
        const finishedStatus = STATUS_NAME.DONE;
        const [{ count }] = await manager.query(`
          SELECT
            COUNT(*)
          FROM
            "task"
          WHERE
            "projectId"=${project.id}
             AND "statusTypeName"='${finishedStatus}'
             AND "isArchived"=false 
        `);
        const [res1] = await manager.query(`
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
        const [weekTaskValue] = await manager.query(`
        SELECT
            COUNT(DISTINCT "task"."id") as count,
            COUNT(DISTINCT "user_tasks"."userId") as "membersCount",
            SUM("task"."value") as value,
            SUM("user_tasks"."time") as time,
            EXTRACT(DOW FROM NOW())::INTEGER as days
        FROM
            "user_tasks"
                LEFT JOIN "task" ON "user_tasks"."taskId"="task"."id"
        WHERE
                "user_tasks"."taskId" IN (
                SELECT
                  DISTINCT "task"."id"
                FROM
                  "task"
                LEFT JOIN "task_log" ON "task_log"."taskId"="task"."id"
                WHERE
                  "task"."statusTypeName" = '${finishedStatus}'
                  AND "task"."projectId"=${project.id}
                  AND "task_log"."createdAt"::DATE >= NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER + 1
                  AND "task"."isArchived" = false
          )
          AND "task"."value" IS NOT NULL;
      `);
        const [monthTasksValue] = await manager.query(`
        SELECT
            COUNT(DISTINCT "task"."id") as count,
            COUNT(DISTINCT "user_tasks"."userId") as "membersCount",
            SUM("task"."value") as value,
            SUM("user_tasks"."time") as time,
            EXTRACT(DAY FROM NOW())::INTEGER as days
        FROM
            "user_tasks"
                LEFT JOIN "task" ON "user_tasks"."taskId"="task"."id"
        WHERE
                "user_tasks"."taskId" IN (
                    SELECT
                      DISTINCT "task"."id"
                    FROM
                      "task"
                    LEFT JOIN "task_log" ON "task_log"."taskId"="task"."id"
                    WHERE
                      "task"."statusTypeName" = '${finishedStatus}'
                      AND "task"."projectId"=${project.id}
                      AND "task_log"."createdAt"::DATE >= NOW()::DATE-EXTRACT(DAY FROM NOW())::INTEGER + 1
                      AND "task"."isArchived" = false
          )
          AND "task"."value" IS NOT NULL;
      `);
        let statisticMetrics = {};
        if (res1) {
          const { developed_seconds, members_count } = res1;
          const developedDays = secondsToDays(developed_seconds);
          const developedMonths = daysToMonths(developedDays);
          const days8hours = millisecondsTo8hoursDays(timeSum);

          statisticMetrics = {
            all: {
              count: parseInt(count, 0),
              days: developedDays,
              membersCount: parseInt(members_count, 0),
              months: developedMonths,
              timeProductivity: timeProductivity(days8hours, developedDays, members_count),
              timeSumIn8hoursDays: days8hours,
              value: valueSum,
            },
            lastWeek: {
              count: parseInt(weekTaskValue.count, 0),
              days: parseInt(weekTaskValue.days, 0),
              membersCount: parseInt(weekTaskValue.membersCount, 0),
              months: 0,
              timeSumIn8hoursDays: millisecondsTo8hoursDays(weekTaskValue.time),
              value: parseInt(weekTaskValue.value, 0),
            },
            lastMonth: {
              count: parseInt(monthTasksValue.count, 0),
              days: parseInt(monthTasksValue.days, 0),
              membersCount: parseInt(monthTasksValue.membersCount, 0),
              months: 1,
              timeSumIn8hoursDays: millisecondsTo8hoursDays(monthTasksValue.time),
              value: parseInt(monthTasksValue.value, 0),
            },
          };
        }

        if (projectWithMembers.pub) {
          await manager.update(
            ProjectPub,
            { uuid: projectWithMembers.pub.uuid },
            {
              statistic: {
                metrics: statisticMetrics,
              },
            }
          );
        }

        result = await manager.find(UserProject, { where: { project } });
      });

      return result;
    } catch (e) {
      throw e;
    }
  }

  async findProjectDetails(project: Project, user: User): Promise<Project> {
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
    p.taskColumns = (await this.getCurrentUserStrategy(project, user)).columns;
    return p;
  }

  /**
   * Возвращает информацию о доступных текущему пользователю перемещениях в рамках текущего проекта.
   * По-сути, этот метод возвращает только ту часть стратегии перемещения задач по проекту,
   * которая доступна текущему пользователю
   *
   * @param project
   * @param user
   * @return Promise<IColumn[]>
   */
  public async getCurrentUserStrategy(project: Project, user: User): Promise<TaskFlowStrategy> {
    let userRoles: ROLE[] = [];
    if (project.strategy !== TASK_FLOW_STRATEGY.SIMPLE) {
      const access = await this.projectRepo.manager.findOne(UserProject, {
        relations: ['roles', 'roles.role', 'roles.allowedMoves', 'roles.allowedMoves.from', 'roles.allowedMoves.to'],
        where: {
          member: { id: user.id },
          project: { id: project.id },
        },
      });
      userRoles = access.roles.map((el) => el.roleId);
    }

    const strategy = new TaskFlowStrategy(project.strategy, userRoles);

    return strategy;
  }

  private async changeStrategy(project: Project, user: User, newStrategy: TASK_FLOW_STRATEGY): Promise<true> {
    if (project.strategy === newStrategy) {
      return true;
    }

    // проверям стратегию В которую собераемся перейти
    switch (newStrategy) {
      case TASK_FLOW_STRATEGY.ADVANCED:
        switch (project.strategy) {
          case TASK_FLOW_STRATEGY.SIMPLE:
            await this.projectRepo.manager.transaction(async (manager) => {
              // 1. заменить status во всех задачах проекта на тот, что указан в конфигурации проекта в таблицах
              await manager.query(
                `UPDATE "task" SET "status"=(SELECT "statusFrom" FROM "task_status" WHERE "name"="task"."statusTypeName")`
              );

              // 2. Проверяем, все ли роли есть в проекте для успешного передвижения по новой стратегии
              project.strategy = newStrategy;
              const strategy = await this.getCurrentUserStrategy(project, user);
              const roles = strategy.roles;
              if (!roles || !roles.length) {
                throw new NotAcceptableException('Не удалось найти роли в стратегии');
              }
              const projectRoles = await manager.find(ProjectRole, {
                where: { roleId: In(roles.map((el) => el.id)), projectId: project.id },
              });
              if (!projectRoles || !roles || projectRoles.length !== roles.length) {
                throw new NotAcceptableException(
                  `Найдено ${projectRoles.length} ролей из ${roles.length} необходимых для данного типа стратегии перемещения задач. Пожалуйста, добавте все необходимые роли для данной стратегии!`
                );
              }

              // 3. Проверяем, есть ли хотя бы один пользователь для каждой роли в новой стратегии
              for (const role of projectRoles) {
                const membersCountRes = await manager.query(
                  `SELECT COUNT(DISTINCT("userProjectMemberId")) FROM "user_project_roles_project_role" WHERE "userProjectProjectId"=${project.id} AND "projectRoleId"=${role.id}`
                );
                if (!parseInt(membersCountRes?.[0]?.count, 0)) {
                  throw new NotAcceptableException(`В проекте нет ни одного пользователя с ролью ${role.roleId}`);
                }
              }
              // TODO: 4. Проверяем, для всех ли ролей в проекте есть замкнутые стратегии передвижения задач
              // TODO: 5. Проверяем, все ли статусы имеют движение вперед.
              //  Какие-то статусы могут не иметь движения назад, но движение вперед должно быть всегда
              // TODO: 6. Проверяем, указана ли роль по-умолчанию для пользователя, который будет подключен к проекту
              // TODO: 7. Добавляем все недостающие разрешенные перемещения
            });

            return true;
          case TASK_FLOW_STRATEGY.DOUBLE_CHECK:
            throw new NotAcceptableException('Такое изменение стратегии не поддерживается!');
          default:
            throw new NotAcceptableException('Такое изменение стратегии не поддерживается!');
        }
      case TASK_FLOW_STRATEGY.SIMPLE:
        switch (project.strategy) {
          case TASK_FLOW_STRATEGY.ADVANCED:
            await this.projectRepo.manager.transaction(async (manager) => {
              // 1. заменить status во всех задачах проекта на тот, что указан в конфиге
              for (const status of Object.values(STATUS_NAME)) {
                await manager.query(
                  `UPDATE "task" SET "status"=${TaskFlowStrategy.statusTypeNameToSimpleStatus(
                    status
                  )} WHERE "statusTypeName"='${status}'`
                );
              }
            });
            return true;
          case TASK_FLOW_STRATEGY.DOUBLE_CHECK:
            throw new NotAcceptableException('Такое изменение стратегии не поддерживается!');
          default:
            throw new NotAcceptableException('Такое изменение стратегии не поддерживается!');
        }
      default:
        throw new NotAcceptableException('Такое изменение стратегии не поддерживается!');
    }
  }
}
