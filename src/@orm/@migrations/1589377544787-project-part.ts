import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectPart1589377544787 implements MigrationInterface {
  name = 'ProjectPart1589377544787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_part" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "parentId" integer, "projectId" integer NOT NULL, CONSTRAINT "PK_22d1b36eae1ba46d80b1e9684ac" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task" ADD "projectPartId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_part" ADD CONSTRAINT "FK_3a6aab9589779fa5e3f468cb9bf" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_part" ADD CONSTRAINT "FK_682a652fa646821ea2f0f055142" FOREIGN KEY ("parentId") REFERENCES "project_part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_d9b4f155e4d2bbcd1c501127f7a" FOREIGN KEY ("projectPartId") REFERENCES "project_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d9b4f155e4d2bbcd1c501127f7a"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_part" DROP CONSTRAINT "FK_682a652fa646821ea2f0f055142"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_part" DROP CONSTRAINT "FK_3a6aab9589779fa5e3f468cb9bf"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "projectPartId"`, undefined);
    await queryRunner.query(`DROP TABLE "project_part"`, undefined);
  }
}
