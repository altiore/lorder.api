import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskStatus1544749944451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "status" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "status"`);
  }
}
