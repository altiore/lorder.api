import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskType1586165042139 implements MigrationInterface {
  name = 'taskType1586165042139';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "project_task_type" WHERE 1=1`);
    await queryRunner.query(`DELETE FROM "task_type" WHERE 1=1`);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "title"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "isPublic"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "icon"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "color"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "name" character varying NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_type" ADD CONSTRAINT "UQ_12c1ef5fffea327f34095b0d4c5" UNIQUE ("name")`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" DROP CONSTRAINT "UQ_12c1ef5fffea327f34095b0d4c5"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "name"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "color" character varying DEFAULT '#D5D5D5'`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "icon" character varying`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "isPublic" boolean NOT NULL DEFAULT false`, undefined);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "title" character varying NOT NULL`, undefined);
  }
}
