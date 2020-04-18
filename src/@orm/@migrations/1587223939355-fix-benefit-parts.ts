import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBenefitParts1587223939355 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const projects = await queryRunner.query(`SELECT "id" FROM "project"`);
    for (const project of projects) {
      const step = 4;
      let i = 0;
      let tasksPart;
      do {
        tasksPart = await queryRunner.query(
          `SELECT "id" FROM "task" WHERE "task"."projectId"=${project.id} ORDER BY "id" ASC LIMIT ${step} OFFSET ${i *
            step}`
        );
        for (const task of tasksPart) {
          const distinctUsers = await queryRunner.query(
            `SELECT DISTINCT "userId" FROM "user_work" WHERE "taskId"=${task.id};`
          );
          if (distinctUsers && distinctUsers.length) {
            const t = 1000000;
            const benefitPart = Math.round(t / distinctUsers.length) / t;
            for (const user of distinctUsers) {
              const userTask = await queryRunner.query(
                `SELECT "userId" FROM "user_tasks" WHERE "userId"=${user.userId}`
              );
              if (!userTask) {
                await queryRunner.query(
                  `INSERT INTO "user_tasks" (userId, taskId, benefitPart) VALUES (${user.userId}, ${
                    task.id
                  }, ${benefitPart})`
                );
              } else {
                await queryRunner.query(
                  `UPDATE "user_tasks" SET "benefitPart"=${benefitPart} WHERE "userId"=${user.userId} AND "taskId"=${
                    task.id
                  }`
                );
              }
            }
          }
        }
        ++i;
      } while (tasksPart.length === step);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
