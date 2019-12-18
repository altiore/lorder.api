import { MigrationInterface, QueryRunner } from "typeorm";

export class taskLog1576691762801 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE "task_log_changetype_enum" AS ENUM('create', 'update', 'move', 'archive', 'delete')`, undefined);
    await queryRunner.query(`CREATE TABLE "task_log" ("id" SERIAL NOT NULL, "changeType" "task_log_changetype_enum" NOT NULL DEFAULT 'update', "prevVersion" text, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" integer NOT NULL, "createdById" integer, CONSTRAINT "PK_0f80f57bb78387f37ef146434b8" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "createdById" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
    await queryRunner.query(`ALTER TABLE "task_log" ADD CONSTRAINT "FK_1142dfec452e924b346f060fdaa" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`, undefined);
    await queryRunner.query(`ALTER TABLE "task_log" ADD CONSTRAINT "FK_3aa841f8c0b5d54a0729f725464" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_log" DROP CONSTRAINT "FK_3aa841f8c0b5d54a0729f725464"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_log" DROP CONSTRAINT "FK_1142dfec452e924b346f060fdaa"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdById"`, undefined);
    await queryRunner.query(`DROP TABLE "task_log"`, undefined);
    await queryRunner.query(`DROP TYPE "task_log_changetype_enum"`, undefined);
  }

}
