import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTaskTaskType1539897926893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ADD "taskTypeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_22167bc49badc61873af119dbaa" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_22167bc49badc61873af119dbaa"`);
    await queryRunner.query(`ALTER TABLE "user_task" DROP COLUMN "taskTypeId"`);
  }
}
