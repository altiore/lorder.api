import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusType1591971527969 implements MigrationInterface {
  name = 'StatusType1591971527969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "statusTypeId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_b56babe1e4a3e595436e19ea040" FOREIGN KEY ("statusTypeId") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_b56babe1e4a3e595436e19ea040"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "statusTypeId"`, undefined);
  }
}
