import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskDescNullable1540297138173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "description" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "description" SET NOT NULL`);
  }
}
