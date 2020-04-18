import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeTaskClosure1587215020439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c"`, undefined);
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5"`, undefined);
    await queryRunner.query(`DROP TABLE "task_closure"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "task_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_4fab3a0649edce0df62d8a240f0" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_beb11f11d4bf1d65f4d55814c1" ON "task_closure" ("id_ancestor") `,
      undefined
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f5f9490c23d691cdf94a02b1a" ON "task_closure" ("id_descendant") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c" FOREIGN KEY ("id_ancestor") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5" FOREIGN KEY ("id_descendant") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }
}
