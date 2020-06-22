import { MigrationInterface, QueryRunner } from 'typeorm';

const taskStatuses = [
  { name: 'creating', statusFrom: 1, statusTo: 1000 },
  { name: 'architect-estimation', statusFrom: 1001, statusTo: 2000 },
  { name: 'prof-estimation', statusFrom: 2001, statusTo: 3000 },
  { name: 'ready-to-do', statusFrom: 3001, statusTo: 4000 },
  { name: 'in-progress', statusFrom: 4001, statusTo: 5000 },
  { name: 'prof-review', statusFrom: 5001, statusTo: 6000 },
  { name: 'testing', statusFrom: 6001, statusTo: 7000 },
  { name: 'architect-review', statusFrom: 7001, statusTo: 8000 },
  { name: 'prof-estimation-2', statusFrom: 8001, statusTo: 9000 },
  { name: 'architect-estimation-2', statusFrom: 9001, statusTo: 10000 },
];

const taskTypes = [
  { name: 'bug' },

  { name: 'feature' },

  { name: 'enhance' },

  { name: 'documentation' },

  { name: 'organize' },
];

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
