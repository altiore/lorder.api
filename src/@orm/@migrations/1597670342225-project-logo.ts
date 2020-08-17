import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectLogo1597670342225 implements MigrationInterface {
  name = 'ProjectLogo1597670342225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "logoId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "UQ_92902197065300289b5de4d1f78" UNIQUE ("logoId")`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_92902197065300289b5de4d1f78" FOREIGN KEY ("logoId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_92902197065300289b5de4d1f78"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_92902197065300289b5de4d1f78"`, undefined);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "logoId"`, undefined);
  }
}
