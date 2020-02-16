import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueProjectRole1581852786316 implements MigrationInterface {
  name = 'UniqueProjectRole1581852786316';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "project_role" ADD CONSTRAINT "UQ_6b8502c10f78d9ded589f565072" UNIQUE ("roleId", "projectId")`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "UQ_6b8502c10f78d9ded589f565072"`, undefined);
  }
}
