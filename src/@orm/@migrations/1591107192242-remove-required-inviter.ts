import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRequiredInviter1591107192242 implements MigrationInterface {
  name = 'RemoveRequiredInviter1591107192242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_c6f518a41f9498b87bc225c3777"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_project" ALTER COLUMN "inviterId" DROP NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_c6f518a41f9498b87bc225c3777" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_project" DROP CONSTRAINT "FK_c6f518a41f9498b87bc225c3777"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_project" ALTER COLUMN "inviterId" SET NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_c6f518a41f9498b87bc225c3777" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
