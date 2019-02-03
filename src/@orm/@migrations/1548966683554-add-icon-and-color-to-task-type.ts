import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIconAndColorToTaskType1548966683554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"`);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "icon" character varying`);
    await queryRunner.query(`ALTER TABLE "task_type" ADD "color" character varying`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5" FOREIGN KEY ("performerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5"`);
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_37835cf91476a114202962303c1"`);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "task_type" DROP COLUMN "icon"`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_39941dc8225d7a2b95aaefa79b5" FOREIGN KEY ("performerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }
}
