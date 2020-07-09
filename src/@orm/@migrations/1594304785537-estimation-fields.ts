import { MigrationInterface, QueryRunner } from 'typeorm';

export class EstimationFields1594304785537 implements MigrationInterface {
  name = 'EstimationFields1594304785537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_tasks_complexity_enum" AS ENUM('0.368', '1', '2.718', '7.389', '20.085', '54.598')`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_tasks" ADD "complexity" "user_tasks_complexity_enum"`, undefined);
    await queryRunner.query(
      `CREATE TYPE "user_tasks_urgency_enum" AS ENUM('0.618', '1', '1.618', '2.618', '4.236')`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_tasks" ADD "urgency" "user_tasks_urgency_enum"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" ADD "value" double precision`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "responsibleId" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "value"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "value" double precision NOT NULL DEFAULT 0`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_4ba68e3e65410dfd632913e4373" FOREIGN KEY ("responsibleId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_4ba68e3e65410dfd632913e4373"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "value"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "value" integer NOT NULL DEFAULT 0`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "responsibleId"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "value"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "urgency"`, undefined);
    await queryRunner.query(`DROP TYPE "user_tasks_urgency_enum"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "complexity"`, undefined);
    await queryRunner.query(`DROP TYPE "user_tasks_complexity_enum"`, undefined);
  }
}
