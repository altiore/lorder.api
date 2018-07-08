import { MigrationInterface, QueryRunner } from 'typeorm';

export class username1529133357577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "identifier" TO "username"`);
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_7efb296eadd258e554e84fa6eb6" TO "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" TO "UQ_7efb296eadd258e554e84fa6eb6"`,
    );
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "identifier"`);
  }
}
