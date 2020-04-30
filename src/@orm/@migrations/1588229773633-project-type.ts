import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectType1588229773633 implements MigrationInterface {
  name = 'ProjectType1588229773633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "project_type_enum" AS ENUM('socially_useful', 'personally_useful')`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "type" "project_type_enum"`, undefined);
    await queryRunner.query(
      `UPDATE "project" SET "type"='personally_useful' WHERE "project"."id" IN (SELECT "defaultProjectId" FROM "user" WHERE 1=1)`
    );
    await queryRunner.query(`UPDATE "project" SET "type"='socially_useful' WHERE "project"."type" IS NULL`);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type" SET NOT NULL`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "type"`, undefined);
    await queryRunner.query(`DROP TYPE "project_type_enum"`, undefined);
  }
}
