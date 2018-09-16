/* tslint:disable */
import { MigrationInterface, QueryRunner } from 'typeorm';

const superAdminEmail = 'razvanlomov@gmail.com';

export class firstSuperAdmin1528214835008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`INSERT INTO "role" (id, name) VALUES (1, 'user'), (2, 'admin'), (3, 'super-admin');`);
    await queryRunner.query(
      `INSERT INTO "user" (identifier, email, tel, status, "paymentMethod") VALUES ('${superAdminEmail}', '${superAdminEmail}', '380508318455', 10, 1);`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "role";`);
    const [{ id: superAdminId }] = await queryRunner.query(`SELECT id FROM "user" WHERE email='${superAdminEmail}';`);
    await queryRunner.query(`DELETE FROM "project" WHERE "ownerId"='${superAdminId}';`);
    await queryRunner.query(`DELETE FROM "user" WHERE email='${superAdminEmail}';`);
  }
}
