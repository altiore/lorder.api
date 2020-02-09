import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleFlow1581263924832 implements MigrationInterface {
  name = 'RoleFlow1581263924832';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "role_flow" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9577f7ce6003446b9ee6feb284e" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(`DELETE FROM "project_role" WHERE 1=1`);
    await queryRunner.query(`DELETE FROM "role" WHERE "name" NOT IN ('user', 'admin', 'super-admin')`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "role_flow"`, undefined);
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
}
