import { MigrationInterface, QueryRunner } from 'typeorm';

export class parentIdConstraint1578241844297 implements MigrationInterface {
  name = 'generated1578241844297';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "parentId" TO "parentTaskId"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5" FOREIGN KEY ("parentTaskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8bf6d736c49d48d91691ea0dfe5"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "parentTaskId" TO "parentId"`, undefined);
  }
}
