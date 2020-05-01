import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLog1588329972209 implements MigrationInterface {
  name = 'UserLog1588329972209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_log" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "prevUserData" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eca046d4b8c20d9309b35f07b69" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "user_log" ADD CONSTRAINT "FK_85f2dd25304ee3a9e43a5c5bcae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined
    );

    await queryRunner.query(`
CREATE OR REPLACE FUNCTION log_user_changes()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO "user_log" ("userId","prevUserData")
    VALUES(OLD."id", to_json(OLD));

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;`);

    await queryRunner.query(`
CREATE TRIGGER user_updates
    BEFORE UPDATE
    ON "user"
    FOR EACH ROW
EXECUTE PROCEDURE log_user_changes();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS user_changes ON "user";`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS log_user_changes;`);

    await queryRunner.query(`ALTER TABLE "user_log" DROP CONSTRAINT "FK_85f2dd25304ee3a9e43a5c5bcae"`, undefined);
    await queryRunner.query(`DROP TABLE "user_log"`, undefined);
  }
}
