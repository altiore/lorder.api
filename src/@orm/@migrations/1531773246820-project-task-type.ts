import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectTaskType1531773246820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "project_task_type" ("order" integer NOT NULL, "projectId" integer NOT NULL, "taskTypeId" integer NOT NULL, CONSTRAINT "PK_700da938f612253c8ea4fd853db" PRIMARY KEY ("projectId", "taskTypeId"))`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_0afef1c76465d5a82374288bb26" FOREIGN KEY ("projectId") REFERENCES "project"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_e06685ddab927a68b73bb6c2f6f" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_e06685ddab927a68b73bb6c2f6f"`);
    await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_0afef1c76465d5a82374288bb26"`);
    await queryRunner.query(`DROP TABLE "project_task_type"`);
  }
}
