import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusMove1588260584528 implements MigrationInterface {
  name = 'StatusMove1588260584528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_66453e3b4f40192904f54543787"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "taskStatusMoveId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" ADD "fromId" integer NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" ADD "toId" integer NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TYPE "public"."project_role_allowed_move_type_enum" RENAME TO "project_role_allowed_move_type_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum" AS ENUM('prepare', 'ask_improve', 'start', 'ask_prepare', 'complete', 'ask_restart', 'estimate', 'ask_recheck')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ALTER COLUMN "type" TYPE "project_role_allowed_move_type_enum" USING "type"::"text"::"project_role_allowed_move_type_enum"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "project_role_allowed_move_type_enum_old"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );

    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_5e190ccfb5710507324f9468c69"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" DROP CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "task_status_move"`, undefined);
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
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum_old" AS ENUM('preparing', 'todo', 'in-progress', 'in-review', 'done')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ALTER COLUMN "type" TYPE "project_role_allowed_move_type_enum_old" USING "type"::"text"::"project_role_allowed_move_type_enum_old"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "project_role_allowed_move_type_enum"`, undefined);
    await queryRunner.query(
      `ALTER TYPE "project_role_allowed_move_type_enum_old" RENAME TO  "project_role_allowed_move_type_enum"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "toId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "fromId"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD "taskStatusMoveId" integer NOT NULL`,
      undefined
    );

    await queryRunner.query(
      `CREATE TABLE "task_status_move" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fromId" integer, "toId" integer, CONSTRAINT "PK_6f27014d54bb1147567b2ca3dd5" PRIMARY KEY ("id"))`,
      undefined
    );

    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );

    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_66453e3b4f40192904f54543787" FOREIGN KEY ("taskStatusMoveId") REFERENCES "task_status_move"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
