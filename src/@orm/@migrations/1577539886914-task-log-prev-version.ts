import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskLogPrevVersion1577539886914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_log" ALTER COLUMN "prevVersion" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "task_log" ALTER COLUMN "prevVersion" SET DEFAULT '{}'`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_log" ALTER COLUMN "prevVersion" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "task_log" ALTER COLUMN "prevVersion" DROP NOT NULL`, undefined);
  }
}
