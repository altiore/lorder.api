import { MigrationInterface, QueryRunner } from 'typeorm';

export class phaseTable1528318457399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "phase" ("id" SERIAL NOT NULL, "title" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer NOT NULL, CONSTRAINT "PK_a9cac5076fb19818ed0f871bea8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "phase" ADD CONSTRAINT "FK_ac2930f63ac7178530329b4b219" FOREIGN KEY ("projectId") REFERENCES "project"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "phase" DROP CONSTRAINT "FK_ac2930f63ac7178530329b4b219"`);
    await queryRunner.query(`DROP TABLE "phase"`);
  }
}
