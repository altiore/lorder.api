import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusFlow1581842101569 implements MigrationInterface {
  name = 'StatusFlow1581842101569';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "task_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_b0c955f276679dd2b2735c3936a" UNIQUE ("name"), CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "task_status_move" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fromId" integer, "toId" integer, CONSTRAINT "PK_6f27014d54bb1147567b2ca3dd5" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum" AS ENUM('preparing', 'todo', 'in-progress', 'in-review', 'done')`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "project_role_allowed_move" ("id" SERIAL NOT NULL, "projectRoleId" integer NOT NULL, "taskStatusMoveId" integer NOT NULL, "type" "project_role_allowed_move_type_enum" NOT NULL, CONSTRAINT "PK_55871468559d01c940a39977009" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "workFlow"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_d8964b2ff316b9bfdf74be5884f" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status_move" ADD CONSTRAINT "FK_5e190ccfb5710507324f9468c69" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_66453e3b4f40192904f54543787" FOREIGN KEY ("taskStatusMoveId") REFERENCES "task_status_move"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_66453e3b4f40192904f54543787"`,
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
    await queryRunner.query(`ALTER TABLE "project_role" ADD "workFlow" text`, undefined);
    await queryRunner.query(`DROP TABLE "project_role_allowed_move"`, undefined);
    await queryRunner.query(`DROP TYPE "project_role_allowed_move_type_enum"`, undefined);
    await queryRunner.query(`DROP TABLE "task_status_move"`, undefined);
    await queryRunner.query(`DROP TABLE "task_status"`, undefined);
  }
}
