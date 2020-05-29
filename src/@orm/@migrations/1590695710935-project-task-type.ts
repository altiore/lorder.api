import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectTaskType1590695710935 implements MigrationInterface {
  name = 'ProjectTaskType1590695710935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cc28034c89dac0657f1593e5c10"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "REL_cc28034c89dac0657f1593e5c1"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeProject"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeTaskType"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeProjectId" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeTaskTypeId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "REL_5c7ae508dcb3570d03b3048999" UNIQUE ("defaultTaskTypeProjectId", "defaultTaskTypeTaskTypeId")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_5c7ae508dcb3570d03b30489992" FOREIGN KEY ("defaultTaskTypeProjectId", "defaultTaskTypeTaskTypeId") REFERENCES "project_task_type"("projectId","taskTypeId") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_5c7ae508dcb3570d03b30489992"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "REL_5c7ae508dcb3570d03b3048999"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeTaskTypeId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "defaultTaskTypeProjectId"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeTaskType" integer`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ADD "defaultTaskTypeProject" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "REL_cc28034c89dac0657f1593e5c1" UNIQUE ("defaultTaskTypeProject", "defaultTaskTypeTaskType")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_cc28034c89dac0657f1593e5c10" FOREIGN KEY ("defaultTaskTypeProject", "defaultTaskTypeTaskType") REFERENCES "project_task_type"("projectId","taskTypeId") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }
}
