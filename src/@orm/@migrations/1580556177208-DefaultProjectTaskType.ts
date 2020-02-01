import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultProjectTaskType1580556177208 implements MigrationInterface {
  name = 'DefaultProjectTaskType1580556177208';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeProject" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeTaskType" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "REL_cc28034c89dac0657f1593e5c1" UNIQUE ("defaultTaskTypeProject", "defaultTaskTypeTaskType")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_cc28034c89dac0657f1593e5c10" FOREIGN KEY ("defaultTaskTypeProject", "defaultTaskTypeTaskType") REFERENCES "project_task_type"("projectId","taskTypeId") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cc28034c89dac0657f1593e5c10"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "REL_cc28034c89dac0657f1593e5c1"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeTaskType"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeProject"`, undefined);
  }
}
