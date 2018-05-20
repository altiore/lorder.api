import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'users';

export class createUserTable1526826461540 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
        },
        {
          name: 'identifier',
          type: 'varchar',
        },
        {
          name: 'status',
          type: 'int',
        },
        {
          name: 'payment_method',
          type: 'int',
        },
        {
          name: 'created_at',
          type: 'timestamp',
        },
        {
          name: 'created_at',
          type: 'timestamp',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(tableName);
  }

}
