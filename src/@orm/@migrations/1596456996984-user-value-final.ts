import { MigrationInterface, QueryRunner } from 'typeorm';

export class userValueFinal1596456996984 implements MigrationInterface {
  name = 'userValueFinal1596456996984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" ADD "userValueFinal" double precision`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "userValueFinal"`, undefined);
  }
}
