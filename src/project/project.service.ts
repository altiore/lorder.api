import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { get, pick } from 'lodash';
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

import { ROLE, STATUS_NAME, TASK_FLOW_STRATEGY, TASK_TYPE } from '../@domains/strategy';
import { TaskFlowStrategy } from '../@domains/strategy';
import { ProjectRole } from '../@orm/project-role/project-role.entity';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskType } from '../@orm/task-type/task-type.entity';
import { UserTask } from '../@orm/user-task';
import { UserWork } from '../@orm/user-work';
import { ProjectPaginationDto } from './@dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectPubRepository) private readonly projectPubRepo: ProjectPubRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository
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

    // 2. добавить в проект тип задачи по-умолчанию
    const taskType = await curManager.findOne(TaskType, { name: TASK_TYPE.FEAT });
    await this.projectTaskTypeRepo.addToProject(project, taskType, curManager);

    // 3. добавить пользователю роль во вновь созданном проекте
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
    updatedProject.taskColumns = (
      await this.getCurrentUserStrategy(updatedProject, user, this.projectRepo.manager)
    ).columns;
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
    const userProjects = await this.userProjectRepo.findAllParticipantProjects(pagesDto, user, minimumAccessLevel);
    await Promise.all(
      userProjects.map(async (uProject) => {
        const strategy = await this.getCurrentUserStrategy(uProject.project, user, this.projectRepo.manager);
        uProject.project.taskColumns = strategy.columns;
        uProject.project.strategyInfo = strategy.public;
      })
    );

    return userProjects;
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

  public async updateStatisticForUserWork(user: User, entityManager: EntityManager, userWork: UserWork): Promise<void> {
    const manager = entityManager || this.projectRepo.manager;

    if (!userWork.projectId) {
      userWork.task = await manager.findOne(Task, { id: userWork.taskId });
    }

    // 1. Удалить статистику для задачи, в которой нет работы
    await manager.query(`
        DELETE FROM "user_tasks" "ut"
            USING "task" AS "t"
        WHERE "t"."id"="ut"."taskId"
          AND "ut"."userId"=${user.id}
          AND "t"."statusTypeName"!='done'
          AND "ut"."complexity" IS NULL
          AND "ut"."urgency" IS NULL
          AND "ut"."userValue" IS NULL
          AND (
                  SELECT COUNT("id")
                  FROM "user_work"
                  WHERE "userId"="ut"."userId"
                    AND "taskId"="ut"."taskId"
              ) = 0
    `);

    // 1.1. Если user_task нет, то создать
    let userTask = await manager.findOne(UserTask, { taskId: userWork.taskId, userId: user.id });
    if (!userTask) {
      userTask = new UserTask();
      userTask.benefitPart = 1;
      userTask.time = 0;
      userTask.userId = user.id;
      userTask.taskId = userWork.taskId;
      await manager.save(userTask);
    }

    // 2. Посчитать статистику по времени для текущего пользователя
    await manager.query(`
      UPDATE "user_tasks"
      SET "time"=COALESCE((
        (
          SELECT SUM(EXTRACT('epoch' from "user_work"."finishAt") - EXTRACT('epoch' from "user_work"."startAt"))
          FROM "user_work"
          WHERE "userId"="user_tasks"."userId"
            AND "taskId"="user_tasks"."taskId"
        ) * 1000
      ), 0)
      WHERE "user_tasks"."userId"=${user.id}
        AND "user_tasks"."taskId"=${userWork.taskId}
    `);

    // 3. Обновить статистику по benefitPart для всех пользователей
    await manager.query(`
      UPDATE "user_tasks" as "updated"
      SET "benefitPart"=COALESCE((
          ROUND(
                  CAST((1 / CAST((SELECT COUNT(*)
                             FROM "user_tasks" as "selected"
                             WHERE "updated"."taskId"="selected"."taskId") AS FLOAT)) AS NUMERIC),
                      6
              )
          ), 0)
      WHERE "updated"."taskId"=${userWork.taskId}
    `);

    // 4. Обновить статистику user_project
    await manager.query(`
      UPDATE "user_project"
      SET "timeSum"=COALESCE((
          SELECT SUM("time_sum_user_tasks"."time")
          FROM "user_tasks" as "time_sum_user_tasks"
          WHERE "user_project"."memberId" = "time_sum_user_tasks"."userId"
            AND "time_sum_user_tasks"."taskId" IN (
              SELECT "id"
              FROM "task" as "first_task"
              WHERE "first_task"."projectId" = "user_project"."projectId"
                AND "first_task"."isArchived"=false
          )
      ), 0),
          "valueSum"=COALESCE((
              SELECT SUM("value_user_tasks"."benefitPart" * "value_task"."value")
              FROM "user_tasks" as "value_user_tasks"
                       LEFT JOIN "task" as "value_task" ON "value_task"."id" = "value_user_tasks"."taskId"
              WHERE "user_project"."memberId" = "value_user_tasks"."userId"
                AND "value_task"."value" IS NOT NULL
                AND "value_user_tasks"."taskId" IN (
                  SELECT "id"
                  FROM "task" as "second_task"
                  WHERE "second_task"."projectId" = "user_project"."projectId"
                    AND "second_task"."isArchived" = false
                    AND "second_task"."statusTypeName" = '${STATUS_NAME.DONE}'
              )
          ), 0)
      WHERE "user_project"."projectId"=${userWork.projectId}
    `);
  }

  public async calculateUserStatistic(user: User, entityManager: EntityManager, projectId: number): Promise<void> {
    const manager = entityManager || this.projectRepo.manager;

    // 1. Удалить статистику для задачи, в которой нет работы
    await manager.query(`
        DELETE FROM "user_tasks" "ut"
            USING "task" AS "t"
        WHERE "t"."id"="ut"."taskId"
          AND "ut"."userId"=${user.id}
          AND "t"."statusTypeName"!='done'
          AND (
                  SELECT COUNT("id")
                  FROM "user_work"
                  WHERE "userId"="ut"."userId"
                    AND "taskId"="ut"."taskId"
              ) = 0
    `);

    // 2. Посчитать статистику по времени для текущего пользователя
    await manager.query(`
      UPDATE "user_tasks"
      SET "time"=COALESCE((
        (
          SELECT SUM(EXTRACT('epoch' from "user_work"."finishAt") - EXTRACT('epoch' from "user_work"."startAt"))
          FROM "user_work"
          WHERE "userId"="user_tasks"."userId"
            AND "taskId"="user_tasks"."taskId"
        ) * 1000
      ), 0)
      WHERE "user_tasks"."userId"=${user.id}
    `);

    // 3. Обновить статистику по benefitPart для всех пользователей
    await manager.query(`
      UPDATE "user_tasks" as "updated"
      SET "benefitPart"=COALESCE((
          ROUND(
                  CAST((1 / CAST((SELECT COUNT(*)
                             FROM "user_tasks" as "selected"
                             WHERE "updated"."taskId"="selected"."taskId") AS FLOAT)) AS NUMERIC),
                      6
              )
          ), 0)
    `);

    // 4. Обновить статистику user_project
    await manager.query(`
      UPDATE "user_project"
      SET "timeSum"=COALESCE((
          SELECT SUM("time_sum_user_tasks"."time")
          FROM "user_tasks" as "time_sum_user_tasks"
          WHERE "user_project"."memberId" = "time_sum_user_tasks"."userId"
            AND "time_sum_user_tasks"."taskId" IN (
              SELECT "id"
              FROM "task" as "first_task"
              WHERE "first_task"."projectId" = "user_project"."projectId"
                AND "first_task"."isArchived"=false
          )
      ), 0),
          "valueSum"=COALESCE((
              SELECT SUM("value_user_tasks"."benefitPart" * "value_task"."value")
              FROM "user_tasks" as "value_user_tasks"
                       LEFT JOIN "task" as "value_task" ON "value_task"."id" = "value_user_tasks"."taskId"
              WHERE "user_project"."memberId" = "value_user_tasks"."userId"
                AND "value_task"."value" IS NOT NULL
                AND "value_user_tasks"."taskId" IN (
                  SELECT "id"
                  FROM "task" as "second_task"
                  WHERE "second_task"."projectId" = "user_project"."projectId"
                    AND "second_task"."isArchived" = false
                    AND "second_task"."statusTypeName" = '${STATUS_NAME.DONE}'
              )
          ), 0)
      WHERE "user_project"."projectId"=${projectId}
    `);
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
          await this.calculateUserStatistic(member.member, manager, projectWithMembers.id);
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
    // 1. находим детальную информацию о проекте для отображения внутренних страниц проекта
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

    // 2. accessLevel необходимо скопировать, т.к. мы не получаем уровень доступа к проекту в последнем запросе
    p.accessLevel = project.accessLevel;

    // 3. добавить информацию о стратегии проекта
    const strategy = await this.getCurrentUserStrategy(p, user, this.projectRepo.manager);
    p.taskColumns = strategy.columns;
    p.strategyInfo = strategy.public;

    return p;
  }

  /**
   * Возвращает информацию о доступных текущему пользователю перемещениях в рамках текущего проекта.
   * По-сути, этот метод возвращает только ту часть стратегии перемещения задач по проекту,
   * которая доступна текущему пользователю
   */
  public async getCurrentUserStrategy(project: Project, user: User, manager: EntityManager): Promise<TaskFlowStrategy> {
    let userRoles: ROLE[] = [];
    if (project.strategy !== TASK_FLOW_STRATEGY.SIMPLE) {
      const access = await manager.findOne(UserProject, {
        relations: ['roles', 'roles.role', 'roles.allowedMoves', 'roles.allowedMoves.from', 'roles.allowedMoves.to'],
        where: {
          member: { id: user.id },
          project: { id: project.id },
        },
      });
      userRoles = access.roles.map((el) => el.roleId);
    }

    return new TaskFlowStrategy(project.strategy, userRoles);
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
              const strategy = await this.getCurrentUserStrategy(project, user, manager);
              const roles = strategy.userStrategyRoles;
              if (!roles || !roles.length) {
                throw new NotAcceptableException('Не удалось найти роли в стратегии');
              }
              const projectRoles = await manager.find(ProjectRole, {
                where: { roleId: In(roles), projectId: project.id },
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
