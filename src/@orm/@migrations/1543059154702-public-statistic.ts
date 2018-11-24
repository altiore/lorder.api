import { MigrationInterface, QueryRunner } from 'typeorm';

export class publicStatistic1543059154702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_pub" ADD "statistic" json NOT NULL DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_pub" DROP COLUMN "statistic"`);
  }
}
