import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskInProgressFlag1593338446005 implements MigrationInterface {
  name = 'TaskInProgressFlag1593338446005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "inProgress" boolean NOT NULL DEFAULT false`, undefined);
    await queryRunner.query(
      `UPDATE "task" SET "inProgress"=true WHERE "id" IN (SELECT "taskId" FROM "user_work" WHERE "finishAt" IS NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "inProgress"`, undefined);
  }
}
