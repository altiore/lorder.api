import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskComment1589797077703 implements MigrationInterface {
  name = 'TaskComment1589797077703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_comment" ("id" SERIAL NOT NULL, "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_28da4411b195bfc3c451cfa21ff" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_comment" ADD CONSTRAINT "FK_5e92c87acf1a8ed40db144e2bdd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_comment" ADD CONSTRAINT "FK_0fed042ede2365de8b32e105cc6" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_0fed042ede2365de8b32e105cc6"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_5e92c87acf1a8ed40db144e2bdd"`, undefined);
    await queryRunner.query(`DROP TABLE "task_comment"`, undefined);
  }
}
