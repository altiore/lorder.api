import { MigrationInterface, QueryRunner } from 'typeorm';

export class typeId1548891639866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" ADD "typeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type"("id") ON DELETE SET NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"`);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "typeId"`);
  }
}
