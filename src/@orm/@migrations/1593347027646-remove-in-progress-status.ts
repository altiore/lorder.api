import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveInProgressStatus1593347027646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`UPDATE "task" SET "statusTypeName"='ready_to_do' WHERE "statusTypeName"='in_progress'`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
