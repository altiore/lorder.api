import { MigrationInterface, QueryRunner } from 'typeorm';

export class setTaskSequenceNumber1577790737709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const projects = await queryRunner.query(`SELECT * FROM "project"`);
    await Promise.all(
      projects.map(async project => {
        const [{ count: tasksCount }] = await queryRunner.query(
          `SELECT count(*) FROM "task" WHERE "projectId"=${project.id}`
        );
        const perRequestCount = 10;
        const pagesCount = Math.ceil(tasksCount / perRequestCount);
        for (let page = 0; page <= pagesCount; page++) {
          const tasks = await queryRunner.query(`
          SELECT
            *
          FROM
            "task"
          WHERE
            "projectId"=${project.id}
          ORDER BY
            "id" ASC
          OFFSET
            ${page * perRequestCount}
          LIMIT
            ${perRequestCount}
        `);
          if (tasks && tasks.length) {
            await Promise.all(
              tasks.map(async (task, index) => {
                return await queryRunner.query(
                  `UPDATE "task" SET "sequenceNumber"=${page * perRequestCount + index + 1} where "id"='${task.id}'
            `
                );
              })
            );
          }
        }
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
