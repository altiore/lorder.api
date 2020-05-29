import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskType1590694921893 implements MigrationInterface {
  name = 'TaskType1590694921893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "task" SET "typeId"=(SELECT "id" FROM "task_type" WHERE "name"='feature') WHERE "typeId" IS NULL`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
      undefined
    );
  }
}
