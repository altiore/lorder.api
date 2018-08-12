import { MigrationInterface, QueryRunner } from 'typeorm';

export class isPublicTaskType1534061318677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" ADD "isPublic" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "isPublic"`);
  }
}
