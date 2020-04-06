import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskStatus1586158865325 implements MigrationInterface {
  name = 'taskStatus1586158865325';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "task_status_move" WHERE 1=1`);
    await queryRunner.query(`DELETE FROM "task_status" WHERE 1=1`);
    await queryRunner.query(`ALTER TABLE "task_status" ADD "statusFrom" integer NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ADD CONSTRAINT "UQ_23693c4f3ee5290a49928536487" UNIQUE ("statusFrom")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" ADD "statusTo" integer NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ADD CONSTRAINT "UQ_fa132eb0412ce8fb924f5b7c070" UNIQUE ("statusTo")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(`CREATE SEQUENCE "task_status_id_seq" OWNED BY "task_status"."id"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ALTER COLUMN "id" SET DEFAULT nextval('task_status_id_seq')`,
      undefined
    );
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
    await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "id" DROP DEFAULT`, undefined);
    await queryRunner.query(`DROP SEQUENCE "task_status_id_seq"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "UQ_fa132eb0412ce8fb924f5b7c070"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "statusTo"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "UQ_23693c4f3ee5290a49928536487"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "statusFrom"`, undefined);
  }
}
