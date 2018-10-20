import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTaskDescriptionNotNull1539935797542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "description" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" ALTER COLUMN "description" SET NOT NULL`);
  }
}
