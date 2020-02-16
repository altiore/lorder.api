import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskStatusConstraints1581842475334 implements MigrationInterface {
  name = 'TaskStatusConstraints1581842475334';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "id" DROP DEFAULT`, undefined);
    await queryRunner.query(`DROP SEQUENCE "task_status_id_seq"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(`CREATE SEQUENCE "task_status_id_seq" OWNED BY "task_status"."id"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ALTER COLUMN "id" SET DEFAULT nextval('task_status_id_seq')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
