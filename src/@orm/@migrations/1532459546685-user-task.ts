import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTask1532459546685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_task" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "description" character varying NOT NULL, "startAt" TIMESTAMP NOT NULL DEFAULT now(), "finishAt" TIMESTAMP NOT NULL DEFAULT now(), "source" character varying NOT NULL, "userId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_ea320dbd04b37ad98f9ff5033f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_4df8c371c74decf9ef093358dad" FOREIGN KEY ("userId") REFERENCES "user"("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_task" ADD CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79" FOREIGN KEY ("taskId") REFERENCES "task"("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_be3c9f1acbe21e0070039b5cf79"`);
    await queryRunner.query(`ALTER TABLE "user_task" DROP CONSTRAINT "FK_4df8c371c74decf9ef093358dad"`);
    await queryRunner.query(`DROP TABLE "user_task"`);
  }
}
