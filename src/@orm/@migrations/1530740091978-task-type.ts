import { MigrationInterface, QueryRunner } from 'typeorm';

export class generated1530740091978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "task_type" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_a0669bd34078f33604ec209dab1" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "task_type"`);
  }
}
