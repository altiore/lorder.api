import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectPub1542104991441 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "project_pub" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "domain" character varying, "title" character varying, "isOpen" boolean NOT NULL DEFAULT true, "projectId" integer NOT NULL, CONSTRAINT "REL_e3a435c1dac6c23d2664ff5af6" UNIQUE ("projectId"), CONSTRAINT "PK_cec950cc879732914299219c4dc" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `ALTER TABLE "project_pub" ADD CONSTRAINT "FK_e3a435c1dac6c23d2664ff5af6f" FOREIGN KEY ("projectId") REFERENCES "project"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_pub" DROP CONSTRAINT "FK_e3a435c1dac6c23d2664ff5af6f"`);
    await queryRunner.query(`DROP TABLE "project_pub"`);
  }
}
