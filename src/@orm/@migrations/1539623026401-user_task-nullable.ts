import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTaskNullable1539623026401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "value" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "finishAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "source" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "source" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "finishAt" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "value" SET NOT NULL`);
  }
}
