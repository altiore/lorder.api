import { MigrationInterface, QueryRunner } from 'typeorm';

export class WebHooks1589989256371 implements MigrationInterface {
  name = 'WebHooks1589989256371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "webhook" ("id" SERIAL NOT NULL, "data" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6765510c2d078db49632b59020" PRIMARY KEY ("id"))`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "webhook"`, undefined);
  }
}
