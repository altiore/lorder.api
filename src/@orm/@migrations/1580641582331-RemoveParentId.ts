import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveParentId1580641582331 implements MigrationInterface {
  name = 'RemoveParentId1580641582331';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c" FOREIGN KEY ("parentTaskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }
}
