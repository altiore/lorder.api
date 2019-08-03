import { MigrationInterface, QueryRunner } from 'typeorm';

export class cloudType1564847262178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "media" ADD "cloud" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "cloud"`);
  }
}
