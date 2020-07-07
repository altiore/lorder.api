import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultTaskValue1594154339246 implements MigrationInterface {
  name = 'DefaultTaskValue1594154339246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "task" SET "value"=0 WHERE "value" IS NULL`);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" SET DEFAULT 0`, undefined);
    await queryRunner.query(
      `ALTER TYPE "public"."project_role_allowed_move_type_enum" RENAME TO "project_role_allowed_move_type_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum" AS ENUM('push_forward', 'bring_back', 'JUMP')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ALTER COLUMN "type" TYPE "project_role_allowed_move_type_enum" USING "type"::"text"::"project_role_allowed_move_type_enum"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "project_role_allowed_move_type_enum_old"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(
      `CREATE TYPE "project_role_allowed_move_type_enum_old" AS ENUM('push_forward', 'bring_back')`,
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
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" DROP NOT NULL`, undefined);
  }
}
