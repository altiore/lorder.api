import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconAndColorToTaskType1548966683554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" ADD "icon" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "color" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "icon"`);
  }
}
