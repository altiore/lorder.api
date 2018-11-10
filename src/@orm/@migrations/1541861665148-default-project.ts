import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultProject1541861665148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "defaultProjectId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "defaultProjectId"`);
  }
}
