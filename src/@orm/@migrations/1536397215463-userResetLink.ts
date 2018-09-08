/* tslint:disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class generated1536397215463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetLink"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "resetLink" character varying`);
  }
}
