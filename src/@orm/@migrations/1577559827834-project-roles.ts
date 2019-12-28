import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectRoles1577559827834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "project_role" ("workFlow" text NOT NULL, "roleId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_6b8502c10f78d9ded589f565072" PRIMARY KEY ("roleId", "projectId"))`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_e3ce53609728362ae1205f060a7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );

    await queryRunner.query(`INSERT INTO "role" (id, name) VALUES
            (11, 'ios-mobile-developer'),
            (12, 'lead-ios-mobile-developer'),
            (14, 'android-mobile-developer'),
            (15, 'lead-android-mobile-developer'),
            (16, 'front-end-developer'),
            (17, 'lead-front-end-developer'),
            (18, 'back-end-developer'),
            (19, 'lead-back-end-developer'),
            (20, 'full-stack-developer'),
            (21, 'lead-full-stack-developer'),
            (22, 'quality-assurance-engineer'),
            (23, 'lead-quality-assurance-engineer'),
            (24, 'designer'),
            (25, 'lead-designer'),
            (26, 'project-architect'),
            (27, 'creator')
        ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM "role" WHERE "id" in (11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27);`
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" DROP CONSTRAINT "FK_e3ce53609728362ae1205f060a7"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "project_role"`, undefined);
  }
}
