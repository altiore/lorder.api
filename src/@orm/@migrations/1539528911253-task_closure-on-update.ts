import { MigrationInterface, QueryRunner } from 'typeorm';

export class taskClosureOnUpdate1539528911253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5"`);
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c"`);
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c" FOREIGN KEY ("id_ancestor") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5" FOREIGN KEY ("id_descendant") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5"`);
    await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c"`);
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c" FOREIGN KEY ("id_ancestor") REFERENCES "task"("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "task_closure" ADD CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5" FOREIGN KEY ("id_descendant") REFERENCES "task"("id")`
    );
  }
}
