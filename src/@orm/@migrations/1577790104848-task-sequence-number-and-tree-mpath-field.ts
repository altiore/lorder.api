import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskSequenceNumberAndTreeMpathField1577790104848 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "sequenceNumber" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD "mpath" character varying DEFAULT ''`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "mpath"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "sequenceNumber"`, undefined);
  }
}
