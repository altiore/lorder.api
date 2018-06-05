import { MigrationInterface, QueryRunner } from 'typeorm';

const superAdminEmail = 'razvanlomov@gmail.com';

export class firstSuperAdmin1528214835008 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`INSERT INTO "role" (name) VALUES ('user'), ('admin'), ('super-admin');`);
    await queryRunner.query(`INSERT INTO "user" (identifier, email, tel, status, "paymentMethod") VALUES ('${superAdminEmail}', '${superAdminEmail}', '380508318455', 10, 1);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "user";`);
    await queryRunner.query(`DELETE FROM "role";`);
  }

}
