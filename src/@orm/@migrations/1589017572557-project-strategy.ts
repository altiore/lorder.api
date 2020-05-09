import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectStrategy1589017572557 implements MigrationInterface {
  name = 'ProjectStrategy1589017572557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "project_strategy_enum" AS ENUM('SIMPLE', 'DOUBLE_CHECK')`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ADD "strategy" "project_strategy_enum" NOT NULL DEFAULT 'SIMPLE'`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "strategy"`, undefined);
    await queryRunner.query(`DROP TYPE "project_strategy_enum"`, undefined);
  }
}
