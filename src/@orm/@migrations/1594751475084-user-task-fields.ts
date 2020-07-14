import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTaskFields1594751475084 implements MigrationInterface {
  name = 'UserTaskFields1594751475084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_tasks_complexity_enum" RENAME TO "user_tasks_complexity_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "user_tasks_complexity_enum" AS ENUM('JUNIOR', 'MIDDLE', 'SENIOR', 'ARCHITECT', 'DISCUSSION', 'COMMUNITY')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ALTER COLUMN "complexity" TYPE "user_tasks_complexity_enum" USING "complexity"::"text"::"user_tasks_complexity_enum"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "user_tasks_complexity_enum_old"`, undefined);
    await queryRunner.query(
      `ALTER TYPE "public"."user_tasks_urgency_enum" RENAME TO "user_tasks_urgency_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "user_tasks_urgency_enum" AS ENUM('LOW', 'REGULAR', 'HIGH', 'CRITICAL', 'ULTRA')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ALTER COLUMN "urgency" TYPE "user_tasks_urgency_enum" USING "urgency"::"text"::"user_tasks_urgency_enum"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "user_tasks_urgency_enum_old"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_tasks_urgency_enum_old" AS ENUM('0.618', '1', '1.618', '2.618', '4.236')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ALTER COLUMN "urgency" TYPE "user_tasks_urgency_enum_old" USING "urgency"::"text"::"user_tasks_urgency_enum_old"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "user_tasks_urgency_enum"`, undefined);
    await queryRunner.query(`ALTER TYPE "user_tasks_urgency_enum_old" RENAME TO  "user_tasks_urgency_enum"`, undefined);
    await queryRunner.query(
      `CREATE TYPE "user_tasks_complexity_enum_old" AS ENUM('0.368', '1', '2.718', '7.389', '20.085', '54.598')`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ALTER COLUMN "complexity" TYPE "user_tasks_complexity_enum_old" USING "complexity"::"text"::"user_tasks_complexity_enum_old"`,
      undefined
    );
    await queryRunner.query(`DROP TYPE "user_tasks_complexity_enum"`, undefined);
    await queryRunner.query(
      `ALTER TYPE "user_tasks_complexity_enum_old" RENAME TO  "user_tasks_complexity_enum"`,
      undefined
    );
  }
}
