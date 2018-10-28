import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSourceToTask1540750858630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "source" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "source"`);
  }
}
