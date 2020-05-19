import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskProjectParts1589899828497 implements MigrationInterface {
  name = 'TaskProjectParts1589899828497'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d9b4f155e4d2bbcd1c501127f7a"`, undefined);
    await queryRunner.query(`CREATE TABLE "task_project_parts_project_part" ("taskId" integer NOT NULL, "projectPartId" integer NOT NULL, CONSTRAINT "PK_4f45f466e5a668538497abcba31" PRIMARY KEY ("taskId", "projectPartId"))`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_b6f887cee37a58ddeddbcb98e0" ON "task_project_parts_project_part" ("taskId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_0ea64a6f83abf78d27cb1d46f3" ON "task_project_parts_project_part" ("projectPartId") `, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "projectPartId"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35" FOREIGN KEY ("projectPartId") REFERENCES "project_part"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "projectPartId" integer`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_0ea64a6f83abf78d27cb1d46f3"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_b6f887cee37a58ddeddbcb98e0"`, undefined);
    await queryRunner.query(`DROP TABLE "task_project_parts_project_part"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_d9b4f155e4d2bbcd1c501127f7a" FOREIGN KEY ("projectPartId") REFERENCES "project_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE`, undefined);
  }

}
