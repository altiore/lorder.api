import { MigrationInterface, QueryRunner } from 'typeorm';

export class avatar1564842629555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "avatar" TO "avatarId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" integer`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5" UNIQUE ("avatarId")`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "media"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" character varying`);
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "avatarId" TO "avatar"`);
  }
}
