import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrevTaskToUserWork1588091514340 implements MigrationInterface {
  name = 'AddPrevTaskToUserWork1588091514340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_work" ADD "prevTaskId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_work" ADD CONSTRAINT "FK_abded6bff6256a52627a372fd12" FOREIGN KEY ("prevTaskId") REFERENCES "task"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_work" DROP CONSTRAINT "FK_abded6bff6256a52627a372fd12"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_work" DROP COLUMN "prevTaskId"`, undefined);
  }
}
