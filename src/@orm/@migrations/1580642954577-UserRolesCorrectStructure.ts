import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesCorrectStructure1580642954577 implements MigrationInterface {
  name = 'UserRolesCorrectStructure1580642954577';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_472b25323af01488f1f66a06b6"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_86033897c009fcca8b6505d6be"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_roles" ADD "id" SERIAL NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_54ee852c4fe81342f9c06ee0fdd" PRIMARY KEY ("userId", "roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_54ee852c4fe81342f9c06ee0fdd"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_f8b2125661a5efb05fba49cc342" PRIMARY KEY ("roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_f8b2125661a5efb05fba49cc342"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")`,
      undefined
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_88481b0c4ed9ada47e9fdd6747" ON "user_roles" ("roleId", "userId") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_88481b0c4ed9ada47e9fdd6747"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_8acd5cf26ebd158416f477de799"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_f8b2125661a5efb05fba49cc342" PRIMARY KEY ("roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_f8b2125661a5efb05fba49cc342"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_54ee852c4fe81342f9c06ee0fdd" PRIMARY KEY ("userId", "roleId", "id")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_54ee852c4fe81342f9c06ee0fdd"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId")`,
      undefined
    );
    await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "id"`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    );
  }
}
