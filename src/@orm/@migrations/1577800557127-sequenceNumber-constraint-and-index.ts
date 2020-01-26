import { MigrationInterface, QueryRunner } from 'typeorm';

export class sequenceNumberConstraintAndIndex1577800557127 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "sequenceNumber" SET NOT NULL`, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_521414f6836d97944e69338e06" ON "task" ("projectId", "sequenceNumber") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "UQ_521414f6836d97944e69338e067" UNIQUE ("projectId", "sequenceNumber")`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "UQ_521414f6836d97944e69338e067"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_521414f6836d97944e69338e06"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "sequenceNumber" DROP NOT NULL`, undefined);
  }
}
