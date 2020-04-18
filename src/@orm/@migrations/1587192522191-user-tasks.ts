import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTasks1587192522191 implements MigrationInterface {
  name = 'userTasks1587192522191';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_83e94423ca0675e4ac503d86413"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_83e94423ca0675e4ac503d8641"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_eff2f1ef189a7952bc6294a1da"`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_83e94423ca0675e4ac503d8641" ON "user_tasks" ("userId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_eff2f1ef189a7952bc6294a1da" ON "user_tasks" ("taskId") `, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_83e94423ca0675e4ac503d86413" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP CONSTRAINT "FK_83e94423ca0675e4ac503d86413"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_eff2f1ef189a7952bc6294a1da"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_83e94423ca0675e4ac503d8641"`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_eff2f1ef189a7952bc6294a1da" ON "user_tasks" ("taskId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_83e94423ca0675e4ac503d8641" ON "user_tasks" ("userId") `, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_eff2f1ef189a7952bc6294a1da5" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD CONSTRAINT "FK_83e94423ca0675e4ac503d86413" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }
}
