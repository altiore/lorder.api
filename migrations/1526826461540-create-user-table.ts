import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'user';

export class createUserTable1526826461540 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'int',
          isNullable: false,
          isGenerated: true,
          isPrimary: true,
          generationStrategy: 'increment',
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
          name: 'paymentMethod',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'createdAt',
          type: 'datetime',
          default: 'NOW()',
        },
        {
          name: 'updatedAt',
          type: 'datetime',
          default: 'NOW()',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(tableName);
  }

}
