import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStatusType1592560389050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "project_role_allowed_move" WHERE 1=1`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b56babe1e4a3e595436e19ea040"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status" DROP COLUMN "id"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ADD "statusTypeName" character varying`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD "fromName" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD "toName" character varying NOT NULL`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_status" ADD CONSTRAINT "PK_b0c955f276679dd2b2735c3936a" PRIMARY KEY ("name")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "UQ_b0c955f276679dd2b2735c3936a"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_47baa086cbf0810a2c0961a42bb" FOREIGN KEY ("fromName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_5f99eb12ecdfd76fc9f5d57c294" FOREIGN KEY ("toName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(`INSERT INTO "task_status" 
("name", "statusFrom", "statusTo")
 VALUES ('done', 10001, 11000);`);

    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "fromId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "toId"`, undefined);

    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "statusTypeId"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "statusTypeId" integer`, undefined);

    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" ADD "toId" integer NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" ADD "fromId" integer NOT NULL`, undefined);

    await queryRunner.query(`DELETE FROM "task_status" WHERE name='done'`);

    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_5f99eb12ecdfd76fc9f5d57c294"`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" DROP CONSTRAINT "FK_47baa086cbf0810a2c0961a42bb"`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task_status" ADD CONSTRAINT "UQ_b0c955f276679dd2b2735c3936a" UNIQUE ("name")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "task_status" DROP CONSTRAINT "PK_b0c955f276679dd2b2735c3936a"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "toName"`, undefined);
    await queryRunner.query(`ALTER TABLE "project_role_allowed_move" DROP COLUMN "fromName"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "statusTypeName"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_status" ADD "id" integer`, undefined);

    await queryRunner.query(`UPDATE "task_status" SET "id"=1 WHERE "name"='creating'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=2 WHERE "name"='architect-estimation'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=3 WHERE "name"='prof-estimation'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=4 WHERE "name"='ready-to-do'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=5 WHERE "name"='in-progress'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=6 WHERE "name"='prof-review'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=7 WHERE "name"='testing'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=8 WHERE "name"='architect-review'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=9 WHERE "name"='prof-estimation-2'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=10 WHERE "name"='architect-estimation-2'`);
    await queryRunner.query(`UPDATE "task_status" SET "id"=11 WHERE "name"='done'`);

    await queryRunner.query(`ALTER TABLE "task_status" ALTER COLUMN "id" SET NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE "task_status" ADD CONSTRAINT "PK_b8747cc6a41b6cef4639babf61d" PRIMARY KEY ("id")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_c9a1ddee1577e1be511d1462cde" FOREIGN KEY ("toId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project_role_allowed_move" ADD CONSTRAINT "FK_fcb83db506c55446d9cb6a0e80d" FOREIGN KEY ("fromId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_b56babe1e4a3e595436e19ea040" FOREIGN KEY ("statusTypeId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
