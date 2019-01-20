import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsArchivedToTasks1547058732110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "isArchived" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isArchived"`);
  }
}
