import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskValueSetNullable1539543278970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "value" SET NOT NULL`);
  }
}
