import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectRoleAllowedMoves1581851161879 implements MigrationInterface {
  name = 'ProjectRoleAllowedMoves1581851161879';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_66453e3b4f40192904f54543787"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" ADD "id" SERIAL NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_6b8502c10f78d9ded589f565072"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_117ede433e9b48a056ed34a734c" PRIMARY KEY ("projectId", "roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" ADD "name" character varying`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_e3ce53609728362ae1205f060a7"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_117ede433e9b48a056ed34a734c"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_10f23f43da365e8ba50e9f74825" PRIMARY KEY ("roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_10f23f43da365e8ba50e9f74825"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_5974798305ac81d4a7d23ab1c6a" PRIMARY KEY ("id")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_6c6edee77e7e8ac259bd4f5cf41" FOREIGN KEY ("projectRoleId") REFERENCES "project_role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_66453e3b4f40192904f54543787" FOREIGN KEY ("taskStatusMoveId") REFERENCES "task_status_move"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role_flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_e3ce53609728362ae1205f060a7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_e3ce53609728362ae1205f060a7"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_66453e3b4f40192904f54543787"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_6c6edee77e7e8ac259bd4f5cf41"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_5974798305ac81d4a7d23ab1c6a"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_10f23f43da365e8ba50e9f74825" PRIMARY KEY ("roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_10f23f43da365e8ba50e9f74825"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_117ede433e9b48a056ed34a734c" PRIMARY KEY ("projectId", "roleId", "id")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_ccacbfebf9617b76351dd93a21c" FOREIGN KEY ("roleId") REFERENCES "role_flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "FK_e3ce53609728362ae1205f060a7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "name"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "PK_117ede433e9b48a056ed34a734c"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "PK_6b8502c10f78d9ded589f565072" PRIMARY KEY ("projectId", "roleId")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "project_role" DROP COLUMN "id"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_66453e3b4f40192904f54543787" FOREIGN KEY ("taskStatusMoveId") REFERENCES "task_status_move"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
