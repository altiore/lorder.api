import { MigrationInterface, QueryRunner } from 'typeorm';

export class userProjectRoles1585902739053 implements MigrationInterface {
  name = 'userProjectRoles1585902739053';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_project_roles_project_role" ("userProjectMemberId" integer NOT NULL, "userProjectProjectId" integer NOT NULL, "projectRoleId" integer NOT NULL, CONSTRAINT "PK_9ea502f5a542dfb0de066d90373" PRIMARY KEY ("userProjectMemberId", "userProjectProjectId", "projectRoleId"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_be7c478d1137a12a9fecacda39" ON "user_project_roles_project_role" ("userProjectMemberId", "userProjectProjectId") `,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67d96ffb96ec74e59cc16614c0" ON "user_project_roles_project_role" ("projectRoleId") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_project_roles_project_role" ADD CONSTRAINT "FK_be7c478d1137a12a9fecacda393" FOREIGN KEY ("userProjectMemberId", "userProjectProjectId") REFERENCES "user_project"("memberId","projectId") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_project_roles_project_role" ADD CONSTRAINT "FK_67d96ffb96ec74e59cc16614c06" FOREIGN KEY ("projectRoleId") REFERENCES "project_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_project_roles_project_role" DROP CONSTRAINT "FK_67d96ffb96ec74e59cc16614c06"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_project_roles_project_role" DROP CONSTRAINT "FK_be7c478d1137a12a9fecacda393"`,
      undefined
    );
    await queryRunner.query(`DROP INDEX "IDX_67d96ffb96ec74e59cc16614c0"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_be7c478d1137a12a9fecacda39"`, undefined);
    await queryRunner.query(`DROP TABLE "user_project_roles_project_role"`, undefined);
  }
}
