import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'role';

export class initialData1527748635562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${tableName} (name) VALUES ('user'), ('admin'), ('super-admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DELETE FROM ${tableName};
    `);
  }
}
