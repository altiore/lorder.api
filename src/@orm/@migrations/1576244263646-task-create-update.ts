import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskCreateUpdate1576244263646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "task" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdAt"`, undefined);
  }
}
