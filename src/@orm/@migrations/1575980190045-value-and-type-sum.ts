import { MigrationInterface, QueryRunner } from 'typeorm';

export class valueAndTypeSum1575980190045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD "timeSum" double precision NOT NULL DEFAULT 0`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD "valueSum" double precision NOT NULL DEFAULT 0`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_project" DROP COLUMN "valueSum"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_project" DROP COLUMN "timeSum"`, undefined);
  }
}
