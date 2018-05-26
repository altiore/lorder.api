import { MigrationInterface, QueryRunner } from 'typeorm';

export class userRolesTable1527352580737 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('CREATE TABLE `user_roles` (`userId` int NOT NULL, `roleId` int NOT NULL, PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB');
    await queryRunner.query('ALTER TABLE `user_roles` ADD CONSTRAINT `FK_472b25323af01488f1f66a06b67` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE');
    await queryRunner.query('ALTER TABLE `user_roles` ADD CONSTRAINT `FK_86033897c009fcca8b6505d6be2` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_86033897c009fcca8b6505d6be2`');
    await queryRunner.query('ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_472b25323af01488f1f66a06b67`');
    await queryRunner.query('DROP TABLE `user_roles`');
  }

}
