/* tslint:disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectTaskType1537964975330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_0afef1c76465d5a82374288bb26"`);
    await queryRunner.query(
      `ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_0afef1c76465d5a82374288bb26" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_0afef1c76465d5a82374288bb26"`);
    await queryRunner.query(
      `ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_0afef1c76465d5a82374288bb26" FOREIGN KEY ("projectId") REFERENCES "project"("id")`
    );
  }
}
