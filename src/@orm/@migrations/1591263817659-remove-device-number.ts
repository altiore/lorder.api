import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDeviceNumber1591263817659 implements MigrationInterface {
  name = 'RemoveDeviceNumber1591263817659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_27e3e7632ac5be042b4b02844c"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_b6710eb464061a11a800efe60a"`, undefined);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "UQ_b6710eb464061a11a800efe60a9"`, undefined);
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "deviceNumber"`, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_29a9fdd522e8e1bdb51cedb1d1" ON "session" ("userId", "device") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "UQ_29a9fdd522e8e1bdb51cedb1d19" UNIQUE ("userId", "device")`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "UQ_29a9fdd522e8e1bdb51cedb1d19"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_29a9fdd522e8e1bdb51cedb1d1"`, undefined);
    await queryRunner.query(`ALTER TABLE "session" ADD "deviceNumber" integer NOT NULL DEFAULT 1`, undefined);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "UQ_b6710eb464061a11a800efe60a9" UNIQUE ("userId", "deviceNumber")`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b6710eb464061a11a800efe60a" ON "session" ("userId", "deviceNumber") `,
      undefined
    );
    await queryRunner.query(`CREATE INDEX "IDX_27e3e7632ac5be042b4b02844c" ON "session" ("deviceNumber") `, undefined);
  }
}
