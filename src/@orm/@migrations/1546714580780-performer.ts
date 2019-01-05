import { MigrationInterface, QueryRunner } from 'typeorm';

export class performer1546714580780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "performerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5" FOREIGN KEY ("performerId") REFERENCES "user"("id") ON DELETE SET NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5"`);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "performerId"`);
  }
}
