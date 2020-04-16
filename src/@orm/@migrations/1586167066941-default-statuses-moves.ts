import { MigrationInterface, QueryRunner } from 'typeorm';

import taskStatuses from '../task-status/default-task-statuses';
import taskTypes from '../task-type/default-task-types';

export class defaultStatusesMoves1586167066941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "task_type" WHERE 1=1`);
    await queryRunner.query(`DELETE FROM "task_status" WHERE 1=1`);

    await queryRunner.query(`
          INSERT INTO "task_type" ("name")
            VALUES ${taskTypes.map(({ name }) => `('${name}')`).join(',')};
        `);

    await queryRunner.query(`
          INSERT INTO "task_status" ("name", "statusFrom", "statusTo")
            VALUES ${taskStatuses
              .map(({ name, statusFrom, statusTo }) => `('${name}', '${statusFrom}', '${statusTo}')`)
              .join(',')};
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "task_type" WHERE 1=1`);
    await queryRunner.query(`DELETE FROM "task_status" WHERE 1=1`);
  }
}
