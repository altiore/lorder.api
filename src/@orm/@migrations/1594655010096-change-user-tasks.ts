import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserTasks1594655010096 implements MigrationInterface {
  name = 'ChangeUserTasks1594655010096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" RENAME COLUMN "value" TO "userValue"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_tasks" RENAME COLUMN "userValue" TO "value"`, undefined);
  }
}
