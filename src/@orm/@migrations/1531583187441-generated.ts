import {MigrationInterface, QueryRunner} from "typeorm";

export class generated1531583187441 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(254), "tel" character varying(13), "status" integer NOT NULL, "paymentMethod" integer, "password" character varying, "resetLink" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ff716f76b4bf8176aa40d0c87ce" UNIQUE ("tel"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "value" integer NOT NULL, "projectId" integer NOT NULL, "parentId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "monthlyBudget" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, "updatorId" integer, "ownerId" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_type" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_a0669bd34078f33604ec209dab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_task_type" ("order" integer NOT NULL, "projectId" integer NOT NULL, "tasktypeId" integer NOT NULL, CONSTRAINT "PK_80a471d588fd073e1aedeef462c" PRIMARY KEY ("projectId", "tasktypeId"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_88481b0c4ed9ada47e9fdd67475" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE TABLE "task_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_4fab3a0649edce0df62d8a240f0" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id")`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c" FOREIGN KEY ("parentId") REFERENCES "task"("id")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3" FOREIGN KEY ("creatorId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_69f6206a176b5f48c9db7367eea" FOREIGN KEY ("updatorId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_0afef1c76465d5a82374288bb26" FOREIGN KEY ("projectId") REFERENCES "project"("id")`);
        await queryRunner.query(`ALTER TABLE "project_task_type" ADD CONSTRAINT "FK_8419fec827fdef193482dde351b" FOREIGN KEY ("tasktypeId") REFERENCES "task_type"("id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_closure" ADD CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c" FOREIGN KEY ("id_ancestor") REFERENCES "task"("id")`);
        await queryRunner.query(`ALTER TABLE "task_closure" ADD CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5" FOREIGN KEY ("id_descendant") REFERENCES "task"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_8f5f9490c23d691cdf94a02b1a5"`);
        await queryRunner.query(`ALTER TABLE "task_closure" DROP CONSTRAINT "FK_beb11f11d4bf1d65f4d55814c1c"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_8419fec827fdef193482dde351b"`);
        await queryRunner.query(`ALTER TABLE "project_task_type" DROP CONSTRAINT "FK_0afef1c76465d5a82374288bb26"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_69f6206a176b5f48c9db7367eea"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8c9920b5fb32c3d8453f64b705c"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
        await queryRunner.query(`DROP TABLE "task_closure"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "project_task_type"`);
        await queryRunner.query(`DROP TABLE "task_type"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
