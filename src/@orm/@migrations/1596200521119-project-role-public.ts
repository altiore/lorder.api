import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectRolePublic1596200521119 implements MigrationInterface {
  name = 'ProjectRolePublic1596200521119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_role" ADD "isPublic" boolean NOT NULL DEFAULT false`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "isPublic"`, undefined);
  }
}
