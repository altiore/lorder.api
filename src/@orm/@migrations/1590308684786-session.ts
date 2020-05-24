import { MigrationInterface, QueryRunner } from 'typeorm';

export class Session1590308684786 implements MigrationInterface {
  name = 'Session1590308684786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "userAgent" character varying NOT NULL, "referer" character varying NOT NULL, "acceptLanguage" character varying NOT NULL, "device" character varying NOT NULL, "deviceNumber" integer NOT NULL DEFAULT 1, "refreshToken" character varying NOT NULL, "headers" json NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8d4c5daf230e32347f71ea7bcaa" UNIQUE ("refreshToken"), CONSTRAINT "UQ_b6710eb464061a11a800efe60a9" UNIQUE ("userId", "deviceNumber"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(`CREATE INDEX "IDX_2e44f7d51f0a009612b8639ebd" ON "session" ("device") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_27e3e7632ac5be042b4b02844c" ON "session" ("deviceNumber") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_8d4c5daf230e32347f71ea7bca" ON "session" ("refreshToken") `, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_b6710eb464061a11a800efe60a" ON "session" ("userId", "deviceNumber") `,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_b6710eb464061a11a800efe60a"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_8d4c5daf230e32347f71ea7bca"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_27e3e7632ac5be042b4b02844c"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_2e44f7d51f0a009612b8639ebd"`, undefined);
    await queryRunner.query(`DROP TABLE "session"`, undefined);
  }
}
