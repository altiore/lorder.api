import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectConstraints1529926157622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3"`);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_69f6206a176b5f48c9db7367eea"`);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "creatorId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "updatorId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3" FOREIGN KEY ("creatorId") REFERENCES "user"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_69f6206a176b5f48c9db7367eea" FOREIGN KEY ("updatorId") REFERENCES "user"("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_69f6206a176b5f48c9db7367eea"`);
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3"`);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "updatorId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "creatorId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_69f6206a176b5f48c9db7367eea" FOREIGN KEY ("updatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }
}
