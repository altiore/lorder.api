import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskStatusPrimary1591965143100 implements MigrationInterface {
  name = 'TaskStatusPrimary1591965143100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "id" DROP DEFAULT`, undefined);
    await queryRunner.query(`DROP SEQUENCE "task_status_id_seq"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d"`,
      undefined
    );
    await queryRunner.query(`CREATE SEQUENCE "task_status_id_seq" OWNED BY "task_status"."id"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ALTER COLUMN "id" SET DEFAULT nextval('task_status_id_seq')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
