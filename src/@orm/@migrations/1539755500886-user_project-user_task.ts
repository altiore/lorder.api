import { MigrationInterface, QueryRunner } from 'typeorm';

export class userProjectUserTask1539755500886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_project" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "finishAt" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "finishAt" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_project" ADD "status" integer NOT NULL DEFAULT 0`);
  }
}
