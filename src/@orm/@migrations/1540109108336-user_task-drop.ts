import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTaskDrop1540109108336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`);
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`);
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_22167bc49badc61873af119dbaa"`);
    await queryRunner.query(`DROP TABLE "user_task"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_task" ("id" SERIAL NOT NULL, "description" character varying, "startAt" TIMESTAMP NOT NULL DEFAULT now(), "finishAt" TIMESTAMP, "value" integer, "source" character varying, "userId" integer NOT NULL, "taskId" integer NOT NULL, "taskTypeId" integer, CONSTRAINT "PK_02da10102e68306a59837a081c1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE cascade ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_22167bc49badc61873af119dbaa" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id")`
    );
  }
}
