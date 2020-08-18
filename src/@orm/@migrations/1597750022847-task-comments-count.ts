import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskCommentsCount1597750022847 implements MigrationInterface {
  name = 'TaskCommentsCount1597750022847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" ADD "commentsCount" integer NOT NULL DEFAULT 0`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "commentsCount"`, undefined);
  }
}
