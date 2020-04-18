import { MigrationInterface, QueryRunner } from 'typeorm';

export class BenefitPart1587201795238 implements MigrationInterface {
  name = 'BenefitPart1587201795238';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_tasks" ADD "benefitPart" double precision NOT NULL DEFAULT 0`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_tasks" DROP COLUMN "benefitPart"`, undefined);
  }
}
