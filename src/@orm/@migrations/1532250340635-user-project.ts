import { MigrationInterface, QueryRunner } from 'typeorm';

export class userProject1532252726452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_project" ("status" integer NOT NULL, "accessLevel" integer NOT NULL, "memberId" integer NOT NULL, "projectId" integer NOT NULL, "inviterId" integer NOT NULL, CONSTRAINT "PK_d63c322d224b62caca7aacf10fe" PRIMARY KEY ("memberId", "projectId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_7d8a12dfc9409f8fb2b5433598a" FOREIGN KEY ("memberId") REFERENCES "user"("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_cb5415b5e54f476329451212e9b" FOREIGN KEY ("projectId") REFERENCES "project"("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_c6f518a41f9498b87bc225c3777" FOREIGN KEY ("inviterId") REFERENCES "user"("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_c6f518a41f9498b87bc225c3777"`);
    await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_cb5415b5e54f476329451212e9b"`);
    await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_7d8a12dfc9409f8fb2b5433598a"`);
    await queryRunner.query(`DROP TABLE "user_project"`);
  }
}
