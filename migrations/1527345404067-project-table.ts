import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectTable1527345510486 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE TABLE `project` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `monthlyBudget` int NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `project`');
  }

}
