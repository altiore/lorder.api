import {MigrationInterface, QueryRunner} from "typeorm";

export class generated1532040568718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_8419fec827fdef193482dde351b"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" RENAME COLUMN "tasktypeId" TO "taskTypeId"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" RENAME CONSTRAINT "PK_80a471d588fd073e1aedeef462c" TO "PK_700da938f612253c8ea4fd853db"`);
        await queryRunner.query(`CREATE TABLE "user_projects" ("status" integer NOT NULL, "accessLevel" integer NOT NULL, "memberIdId" integer NOT NULL, "projectIdId" integer NOT NULL, CONSTRAINT "PK_bf681ca3be8535bf05d82bebac0" PRIMARY KEY ("memberIdId", "projectIdId"))`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_c76a40e312450f665376c8da2c0" FOREIGN KEY ("memberIdId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_projects" ADD CONSTRAINT "FK_cec5761358b1c96d1c7d0fda782" FOREIGN KEY ("projectIdId") REFERENCES "project"("id")`);
        await queryRunner.query(`ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_e06685ddab927a68b73bb6c2f6f" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_e06685ddab927a68b73bb6c2f6f"`);
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_cec5761358b1c96d1c7d0fda782"`);
        await queryRunner.query(`ALTER TABLE "user_projects" DROP CONSTRAINT "FK_c76a40e312450f665376c8da2c0"`);
        await queryRunner.query(`DROP TABLE "user_projects"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" RENAME CONSTRAINT "PK_700da938f612253c8ea4fd853db" TO "PK_80a471d588fd073e1aedeef462c"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" RENAME COLUMN "taskTypeId" TO "tasktypeId"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_8419fec827fdef193482dde351b" FOREIGN KEY ("tasktypeId") REFERENCES "task_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
