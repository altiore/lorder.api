import { MigrationInterface, QueryRunner } from 'typeorm';

export class unique1527352967907 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `role` ADD UNIQUE INDEX `IDX_ae4578dcaed5adff96595e6166` (`name`)');
    await queryRunner.query('ALTER TABLE `user` ADD UNIQUE INDEX `IDX_7efb296eadd258e554e84fa6eb` (`identifier`)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user` DROP INDEX `IDX_7efb296eadd258e554e84fa6eb`');
    await queryRunner.query('ALTER TABLE `role` DROP INDEX `IDX_ae4578dcaed5adff96595e6166`');
  }

}
