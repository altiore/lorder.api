import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectOwner1527953225616 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `project` ADD `creatorId` int NOT NULL');
    await queryRunner.query('ALTER TABLE `project` ADD `updatorId` int NOT NULL');
    await queryRunner.query('ALTER TABLE `project` ADD `ownerId` int NOT NULL');
    await queryRunner.query('ALTER TABLE `project` ADD CONSTRAINT `FK_cfb02dac45e9dec5b82f960b3e3` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`)');
    await queryRunner.query('ALTER TABLE `project` ADD CONSTRAINT `FK_69f6206a176b5f48c9db7367eea` FOREIGN KEY (`updatorId`) REFERENCES `user`(`id`)');
    await queryRunner.query('ALTER TABLE `project` ADD CONSTRAINT `FK_9884b2ee80eb70b7db4f12e8aed` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `project` DROP FOREIGN KEY `FK_9884b2ee80eb70b7db4f12e8aed`');
    await queryRunner.query('ALTER TABLE `project` DROP FOREIGN KEY `FK_69f6206a176b5f48c9db7367eea`');
    await queryRunner.query('ALTER TABLE `project` DROP FOREIGN KEY `FK_cfb02dac45e9dec5b82f960b3e3`');
    await queryRunner.query('ALTER TABLE `project` DROP COLUMN `ownerId`');
    await queryRunner.query('ALTER TABLE `project` DROP COLUMN `updatorId`');
    await queryRunner.query('ALTER TABLE `project` DROP COLUMN `creatorId`');
  }

}
