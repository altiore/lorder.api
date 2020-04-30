import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultProject1588230522935 implements MigrationInterface {
  name = 'DefaultProject1588230522935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type" SET DEFAULT 'socially_useful'`, undefined);
    await queryRunner.query(
      `UPDATE "user" SET "defaultProjectId"=NULL WHERE "defaultProjectId" NOT IN (SELECT "id" FROM "project" WHERE 1=1)`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_ce161b2243a6ba0cbaddd32add7" FOREIGN KEY ("defaultProjectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ce161b2243a6ba0cbaddd32add7"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "type" DROP DEFAULT`, undefined);
  }
}
