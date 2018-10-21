import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTaskRelation1540109780563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_tasks" ("userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_a0db1c8e3e4e9bb4ddf2523fe42" PRIMARY KEY ("userId", "taskId"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_83e94423ca0675e4ac503d86413" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5"`);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_83e94423ca0675e4ac503d86413"`);
    await queryRunner.query(`DROP TABLE "user_tasks"`);
  }
}
