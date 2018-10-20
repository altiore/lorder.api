import { MigrationInterface, QueryRunner } from 'typeorm';

export class userWork1540020523468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_work" ("id" SERIAL NOT NULL, "description" character varying, "startAt" TIMESTAMP NOT NULL DEFAULT now(), "finishAt" TIMESTAMP, "value" integer, "source" character varying, "userId" integer NOT NULL, "taskId" integer NOT NULL, "taskTypeId" integer, CONSTRAINT "PK_02da10102e68306a59837a081c6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_work" ADD CONSTRAINT "FK_a7c71b593da521d2aac44d20ebf" FOREIGN KEY ("userId") REFERENCES "user"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_work" ADD CONSTRAINT "FK_d8ece38284b7c03f8bce22dd399" FOREIGN KEY ("taskId") REFERENCES "task"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "user_work" ADD CONSTRAINT "FK_3ba46052bea69b65f59a43a3295" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_work" DROP CONSTRAINT "FK_3ba46052bea69b65f59a43a3295"`);
    await queryRunner.query(`ALTER TABLE "user_work" DROP CONSTRAINT "FK_d8ece38284b7c03f8bce22dd399"`);
    await queryRunner.query(`ALTER TABLE "user_work" DROP CONSTRAINT "FK_a7c71b593da521d2aac44d20ebf"`);
    await queryRunner.query(`DROP TABLE "user_work"`);
  }
}
