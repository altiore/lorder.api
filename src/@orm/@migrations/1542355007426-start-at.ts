import { MigrationInterface, QueryRunner } from 'typeorm';

export class startAt1542355007426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_work" ALTER COLUMN "startAt" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_work" ALTER COLUMN "startAt" SET DEFAULT now()`);
  }
}
