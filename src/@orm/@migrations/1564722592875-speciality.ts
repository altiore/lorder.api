import { MigrationInterface, QueryRunner } from 'typeorm';

export class speciality1564722592875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "specialty" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "UQ_2c1c2383fec95bc67025a17e550" UNIQUE ("title"), CONSTRAINT "PK_9cf4ae334dc4a1ab1e08956460e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE SEQUENCE "media_id_seq" OWNED BY "media"."id"`);
    await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "id" SET DEFAULT nextval('media_id_seq')`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "media" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "media_id_seq"`);
    await queryRunner.query(`DROP TABLE "specialty"`);
  }
}
