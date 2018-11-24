import { MigrationInterface, QueryRunner } from 'typeorm';

const email = 'lider640@mail.ru';
const projectTitle = 'Free World';

export class updateEugen1543083619973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const [user] = await queryRunner.query(`SELECT "id" from "user" where "email"='${email}'`);
    const [project] = await queryRunner.query(`SELECT "id" from "project" where "title"='${projectTitle}'`);
    if (user && project) {
      await queryRunner.query(
        `UPDATE "user_project" SET "accessLevel"=4 where "projectId"='${project.id}' AND "memberId"='${user.id}'`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const [user] = await queryRunner.query(`SELECT "id" from "user" where "email"='${email}'`);
    const [project] = await queryRunner.query(`SELECT "id" from "project" where "title"='${projectTitle}'`);
    if (user && project) {
      await queryRunner.query(
        `UPDATE "user_project" SET "accessLevel"=1 where "projectId"='${project.id}' AND "memberId"='${user.id}'`
      );
    }
  }
}
