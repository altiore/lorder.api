import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectDesc1591103294897 implements MigrationInterface {
  name = 'ProjectDesc1591103294897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "desc" character varying`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "slogan" character varying`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "slogan"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "desc"`, undefined);
  }
}
