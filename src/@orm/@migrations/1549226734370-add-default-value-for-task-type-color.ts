import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDefaultValueForTaskTypeColor1549226734370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" ALTER COLUMN "color" SET DEFAULT '#D5D5D5'`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_type" ALTER COLUMN "color" DROP DEFAULT`);
  }
}
