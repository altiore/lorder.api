import { MigrationInterface, QueryRunner } from 'typeorm';

export class userEmailTel1527354199560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user` ADD `email` varchar(254) NULL');
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)',
    );
    await queryRunner.query('ALTER TABLE `user` ADD `tel` varchar(13) NULL');
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_ff716f76b4bf8176aa40d0c87c` (`tel`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_ff716f76b4bf8176aa40d0c87c`',
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `tel`');
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`',
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `email`');
  }
}
