import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimeToUserTasks1587628680249 implements MigrationInterface {
  name = 'AddTimeToUserTasks1587628680249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" ADD "time" double precision NOT NULL DEFAULT 0`, undefined);

    await queryRunner.query(
      `DELETE FROM "user_tasks" WHERE (SELECT SUM(EXTRACT('epoch' from "user_work"."finishAt") - EXTRACT('epoch' from "user_work"."startAt")) FROM "user_work" WHERE "userId"="user_tasks"."userId" AND "taskId"="user_tasks"."taskId") IS NULL`
    );

    await queryRunner.query(
      `UPDATE "user_tasks" SET "time"=((SELECT SUM(EXTRACT('epoch' from "user_work"."finishAt") - EXTRACT('epoch' from "user_work"."startAt")) FROM "user_work" WHERE "userId"="user_tasks"."userId" AND "taskId"="user_tasks"."taskId")*1000)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "time"`, undefined);
  }
}
