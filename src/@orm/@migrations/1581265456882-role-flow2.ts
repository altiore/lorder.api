import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleFlow21581265456882 implements MigrationInterface {
  name = 'RoleFlow21581265456882';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_6b8502c10f78d9ded589f565072"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_e3ce53609728362ae1205f060a7" PRIMARY KEY ("projectId")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "roleId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" ADD "roleId" character varying NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_e3ce53609728362ae1205f060a7"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_6b8502c10f78d9ded589f565072" PRIMARY KEY ("projectId", "roleId")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role_flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_6b8502c10f78d9ded589f565072"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_e3ce53609728362ae1205f060a7" PRIMARY KEY ("projectId")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "roleId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" ADD "roleId" integer NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_e3ce53609728362ae1205f060a7"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_6b8502c10f78d9ded589f565072" PRIMARY KEY ("roleId", "projectId")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
