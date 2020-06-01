import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskProjectParts1591001861232 implements MigrationInterface {
  name = 'TaskProjectParts1591001861232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35" FOREIGN KEY ("projectPartId") REFERENCES "project_part"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" DROP CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_0ea64a6f83abf78d27cb1d46f35" FOREIGN KEY ("projectPartId") REFERENCES "project_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_project_parts_project_part" ADD CONSTRAINT "FK_b6f887cee37a58ddeddbcb98e0a" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
  }
}
