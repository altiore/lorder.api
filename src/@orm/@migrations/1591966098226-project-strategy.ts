import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectStrategy1591966098226 implements MigrationInterface {
  name = 'ProjectStrategy1591966098226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."project_strategy_enum" RENAME TO "project_strategy_enum_old"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TYPE "project_strategy_enum" AS ENUM('ADVANCED', 'SIMPLE', 'DOUBLE_CHECK')`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "strategy" DROP DEFAULT`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "strategy" TYPE "project_strategy_enum" USING "strategy"::"text"::"project_strategy_enum"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "strategy" SET DEFAULT 'SIMPLE'`, undefined);
    await queryRunner.query(`DROP TYPE "project_strategy_enum_old"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "project_strategy_enum_old" AS ENUM('SIMPLE', 'DOUBLE_CHECK')`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "strategy" DROP DEFAULT`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "strategy" TYPE "project_strategy_enum_old" USING "strategy"::"text"::"project_strategy_enum_old"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "strategy" SET DEFAULT 'SIMPLE'`, undefined);
    await queryRunner.query(`DROP TYPE "project_strategy_enum"`, undefined);
    await queryRunner.query(`ALTER TYPE "project_strategy_enum_old" RENAME TO  "project_strategy_enum"`, undefined);
  }
}
