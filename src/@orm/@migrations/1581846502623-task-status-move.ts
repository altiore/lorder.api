import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskStatusMove1581846502623 implements MigrationInterface {
  name = 'TaskStatusMove1581846502623';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status_move" ALTER COLUMN "fromId" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status_move" ALTER COLUMN "toId" SET NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status_move" ADD "name" character varying`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_status_move" DROP COLUMN "name"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status_move" ALTER COLUMN "toId" DROP NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status_move" ALTER COLUMN "fromId" DROP NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
