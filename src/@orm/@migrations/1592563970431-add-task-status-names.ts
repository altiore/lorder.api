import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskStatusNames1592563970431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`UPDATE "task" SET "statusTypeName" = 'created' WHERE "task"."status"=0`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName" = 'ready-to-do' WHERE "task"."status"=1`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName" = 'in-progress' WHERE "task"."status"=2`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName" = 'testing' WHERE "task"."status"=3`);
    await queryRunner.query(`UPDATE "task" SET "statusTypeName" = 'done' WHERE "task"."status"=4`);

    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" SET NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095"`, undefined);
    await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "statusTypeName" DROP NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_a39a5f3d713e0f5d321f20e8095" FOREIGN KEY ("statusTypeName") REFERENCES "task_status"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }
}
