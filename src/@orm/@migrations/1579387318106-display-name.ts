import { MigrationInterface, QueryRunner } from 'typeorm';

export class displayName1579387318106 implements MigrationInterface {
  name = 'displayName1579387318106';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "displayName" character varying`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "displayName"`, undefined);
  }
}
