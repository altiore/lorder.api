import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateLast1570962227853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_83e94423ca0675e4ac503d8641" ON "user_tasks" ("userId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_eff2f1ef189a7952bc6294a1da" ON "user_tasks" ("taskId") `, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_eff2f1ef189a7952bc6294a1da"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_83e94423ca0675e4ac503d8641"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_86033897c009fcca8b6505d6be"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_472b25323af01488f1f66a06b6"`, undefined);
  }
}
