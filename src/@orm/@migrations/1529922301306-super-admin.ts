import { MigrationInterface, QueryRunner } from 'typeorm';

const superAdminEmail = 'razvanlomov@gmail.com';

export class superAdmin1529922301306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const [{ id: superAdminId }] = await queryRunner.query(`SELECT id FROM "user" WHERE email='${superAdminEmail}';`);
    const [{ id: superAdminRoleId }] = await queryRunner.query(`SELECT id FROM "role" WHERE name='super-admin';`);
    const [{ id: adminRoleId }] = await queryRunner.query(`SELECT id FROM "role" WHERE name='admin';`);
    const [{ id: userRoleId }] = await queryRunner.query(`SELECT id FROM "role" WHERE name='user';`);
    await queryRunner.query(
      `INSERT INTO "user_roles" ("userId", "roleId") VALUES (${superAdminId}, ${superAdminRoleId}), (${superAdminId}, ${adminRoleId}), (${superAdminId}, ${userRoleId});`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const [{ id: superAdminId }] = await queryRunner.query(`SELECT id FROM "user" WHERE email='${superAdminEmail}';`);
    await queryRunner.query(`DELETE FROM "user_roles" WHERE "userId"='${superAdminId}';`);
  }
}
