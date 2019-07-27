import { MigrationInterface, QueryRunner } from 'typeorm';

export class media1564214900182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "media" ("id" integer NOT NULL, "url" character varying NOT NULL, "title" character varying, "type" text NOT NULL, CONSTRAINT "UQ_42a60c07e4b566f0cc06a1eaaff" UNIQUE ("url"), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "media"`);
  }
}
