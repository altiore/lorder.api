import { MigrationInterface, QueryRunner } from 'typeorm';

export class task1530449612804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "value" integer NOT NULL, "projectId" integer NOT NULL, "parentId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "task_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_4fab3a0649edce0df62d8a240f0" PRIMARY KEY ("id_ancestor", "id_descendant"))`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c" FOREIGN KEY ("parentId") REFERENCES "task"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c" FOREIGN KEY ("id_ancestor") REFERENCES "task"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5" FOREIGN KEY ("id_descendant") REFERENCES "task"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5"`);
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
    await queryRunner.query(`DROP TABLE "task_closure"`);
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
