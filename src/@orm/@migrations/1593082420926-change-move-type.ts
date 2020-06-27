import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMoveType1593082420926 implements MigrationInterface {
  name = 'ChangeMoveType1593082420926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD "taskTypeProjectId" integer NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD "taskTypeTaskTypeId" integer NOT NULL`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" DROP NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TYPE "public"."project_role_allowed_move_type_enum" RENAME TO "project_role_allowed_move_type_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum" AS ENUM('push_forward', 'bring_back')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ALTER COLUMN "type" TYPE "project_role_allowed_move_type_enum" USING "type"::"text"::"project_role_allowed_move_type_enum"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "project_role_allowed_move_type_enum_old"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_6304f696c3ee8d5b287c9d1b1cb" FOREIGN KEY ("taskTypeProjectId", "taskTypeTaskTypeId") REFERENCES "project_task_type"("projectId","taskTypeId") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );

    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role_flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );

    await queryRunner.query(`UPDATE "role_flow" SET "id"='qa-engineer' WHERE "id"='qa-ingener'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "role_flow" SET "id"='qa-ingener' WHERE "id"='qa-engineer'`);

    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role_flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );

    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_6304f696c3ee8d5b287c9d1b1cb"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum_old" AS ENUM('prepare', 'ask_improve', 'start', 'ask_prepare', 'complete', 'ask_restart', 'estimate', 'ask_recheck')`,
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
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "taskTypeTaskTypeId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "taskTypeProjectId"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
