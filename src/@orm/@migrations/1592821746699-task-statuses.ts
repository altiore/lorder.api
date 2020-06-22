import { MigrationInterface, QueryRunner } from 'typeorm';

export enum STATUS_NAME {
  CREATING = 'creating',
  ESTIMATION_BEFORE_ASSIGNING = 'estimation_before_assigning',
  ASSIGNING_RESPONSIBLE = 'assigning_responsible',
  ESTIMATION_BEFORE_PERFORMER = 'estimating_before_PERFORMER',
  ASSIGNING_PERFORMER = 'assigning_performer',
  ESTIMATION_BEFORE_TO_DO = 'estimation_before_to_do',
  READY_TO_DO = 'ready_to_do',
  IN_PROGRESS = 'in_progress',
  AUTO_TESTING = 'auto_testing',
  PROF_REVIEW = 'prof_review',
  ESTIMATION_BEFORE_TEST = 'estimation_before_test',
  READY_TO_TEST = 'ready_to_test',
  TESTING = 'testing',
  ARCHITECT_REVIEW = 'architect_review',
  READY_TO_DEPLOY = 'ready_to_deploy',
  DEPLOYING = 'deploying',
  DEPLOYED_PROF_ESTIMATION = 'deployed_prof_estimation',
  DEPLOYED_ARCHITECT_ESTIMATION = 'deployed_architect_estimation',
  DEPLOYED_COMMUNITY_ESTIMATION = 'deployed_community_estimation',
  DEPLOYED_ESTIMATION = 'deployed_estimating',
  DONE = 'done',
}

const taskStatuses: Array<{ name: STATUS_NAME; statusFrom: number; statusTo: number }> = [
  { name: STATUS_NAME.CREATING, statusFrom: 1, statusTo: 1000 },
  { name: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING, statusFrom: 1001, statusTo: 2000 },
  { name: STATUS_NAME.ASSIGNING_RESPONSIBLE, statusFrom: 2001, statusTo: 3000 },
  { name: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER, statusFrom: 3001, statusTo: 4000 },
  { name: STATUS_NAME.ASSIGNING_PERFORMER, statusFrom: 4001, statusTo: 5000 },
  { name: STATUS_NAME.ESTIMATION_BEFORE_TO_DO, statusFrom: 5001, statusTo: 6000 },
  { name: STATUS_NAME.READY_TO_DO, statusFrom: 6001, statusTo: 7000 },
  { name: STATUS_NAME.IN_PROGRESS, statusFrom: 7001, statusTo: 8000 },
  { name: STATUS_NAME.AUTO_TESTING, statusFrom: 8001, statusTo: 9000 },
  { name: STATUS_NAME.PROF_REVIEW, statusFrom: 9001, statusTo: 10000 },
  { name: STATUS_NAME.ESTIMATION_BEFORE_TEST, statusFrom: 10001, statusTo: 11000 },
  { name: STATUS_NAME.READY_TO_TEST, statusFrom: 11001, statusTo: 12000 },
  { name: STATUS_NAME.TESTING, statusFrom: 12001, statusTo: 13000 },
  { name: STATUS_NAME.ARCHITECT_REVIEW, statusFrom: 13001, statusTo: 14000 },
  { name: STATUS_NAME.READY_TO_DEPLOY, statusFrom: 14001, statusTo: 15000 },
  { name: STATUS_NAME.DEPLOYING, statusFrom: 15001, statusTo: 16000 },
  { name: STATUS_NAME.DEPLOYED_PROF_ESTIMATION, statusFrom: 16001, statusTo: 17000 },
  { name: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION, statusFrom: 17001, statusTo: 18000 },
  { name: STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION, statusFrom: 18001, statusTo: 19000 },
  { name: STATUS_NAME.DEPLOYED_ESTIMATION, statusFrom: 19001, statusTo: 20000 },
  { name: STATUS_NAME.DONE, statusFrom: 20001, statusTo: 21000 },
];

const oldTaskStatuses = [
  { name: 'creating', statusFrom: 1, statusTo: 1000 },
  { name: 'architect-estimation', statusFrom: 1001, statusTo: 2000 },
  { name: 'prof-estimation', statusFrom: 2001, statusTo: 3000 },
  { name: 'ready-to-do', statusFrom: 3001, statusTo: 4000 },
  { name: 'in-progress', statusFrom: 4001, statusTo: 5000 },
  { name: 'prof-review', statusFrom: 5001, statusTo: 6000 },
  { name: 'testing', statusFrom: 6001, statusTo: 7000 },
  { name: 'architect-review', statusFrom: 7001, statusTo: 8000 },
  { name: 'prof-estimation-2', statusFrom: 8001, statusTo: 9000 },
  { name: 'architect-estimation-2', statusFrom: 9001, statusTo: 10000 },
  { name: 'done', statusFrom: 10001, statusTo: 11000 },
];

export class TaskStatuses1592821746699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "project_role_allowed_move" WHERE 1=1`);

    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" DROP NOT NULL`, undefined);

    await queryRunner.query(`UPDATE "task" SET "statusTypeName"='ready_to_do' WHERE "statusTypeName"='ready-to-do'`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName"='in_progress' WHERE "statusTypeName"='in-progress'`);

    await queryRunner.query(`DELETE FROM "task_status" WHERE 1=1`);

    await queryRunner.query(`
          INSERT INTO "task_status" ("name", "statusFrom", "statusTo")
            VALUES ${taskStatuses
              .map(({ name, statusFrom, statusTo }) => `('${name}', '${statusFrom}', '${statusTo}')`)
              .join(',')};
        `);

    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" SET NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" DROP NOT NULL`, undefined);

    await queryRunner.query(`UPDATE "task" SET "statusTypeName"='ready-to-do' WHERE "statusTypeName"='ready_to_do'`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName"='in-progress' WHERE "statusTypeName"='in_progress'`);

    await queryRunner.query(`DELETE FROM "task_status" WHERE 1=1`);

    await queryRunner.query(`
          INSERT INTO "task_status" ("name", "statusFrom", "statusTo")
            VALUES ${oldTaskStatuses
              .map(({ name, statusFrom, statusTo }) => `('${name}', '${statusFrom}', '${statusTo}')`)
              .join(',')};
        `);

    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" SET NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
