import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkType1548844405906 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "work_type" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_3906cb061b122c41de5349c7935" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_work_type" ("hourValue" integer NOT NULL, "userId" integer NOT NULL, "workTypeId" integer NOT NULL, CONSTRAINT "PK_c6aed7ce790b7cf3f6c3069052d" PRIMARY KEY ("userId", "workTypeId"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_work_type" ADD CONSTRAINT "FK_36ca3a23fee0b94a8b5cbe19f95" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_work_type" ADD CONSTRAINT "FK_56a12a93991e3921f8d85d8af98" FOREIGN KEY ("workTypeId") REFERENCES "work_type"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_work_type" DROP CONSTRAINT "FK_56a12a93991e3921f8d85d8af98"`);
    await queryRunner.query(`ALTER TABLE "user_work_type" DROP CONSTRAINT "FK_36ca3a23fee0b94a8b5cbe19f95"`);
    await queryRunner.query(`DROP TABLE "user_work_type"`);
    await queryRunner.query(`DROP TABLE "work_type"`);
  }
}
