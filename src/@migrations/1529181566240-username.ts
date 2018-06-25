import { MigrationInterface, QueryRunner } from 'typeorm';

export class username1529181566240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying`);
    await queryRunner.query(`UPDATE "user" SET "username"="user".email`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
  }
}
