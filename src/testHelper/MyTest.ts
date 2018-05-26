import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { getConnection } from 'typeorm';

export class MyTest {
  private static fixtures = [];

  private static runMigrations() {
    // TODO: move this config to test config file
    process.env.TYPEORM_DATABASE = 'altiore_contrib_test';
    function runCommand(command, callback) {

      const child = exec(command, (err, stdout, stderr) => {
        if (err != null) {
          return callback(err, null);
        } else if (typeof(stderr) !== 'string') {
          return callback(new Error(stderr), null);
        } else {
          return callback(null, stdout);
        }
      });
      child.on('close', (code) => {
        console.log('child ended with: ' + code);
      });
      child.on('error', (err) => {
        console.log('child errd with: ' + err);
      });
      child.stdout.on('data', (d) => {
        console.log(d);
      });

    }

    return new Promise((resove, reject) => {
      runCommand(`${__dirname}/../../node_modules/.bin/ts-node ${__dirname}/../../node_modules/.bin/typeorm migration:run`, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resove(stdout);
        }
      });
    });
  }

  public static async create(entities, params, fixtures = []): Promise<TestingModule> {
    // 1. run migrations
    await MyTest.runMigrations();

    const app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(),
      ],
      ...params,
    }).compile();

    // 2. load fixtures
    if (fixtures.length) {
      MyTest.fixtures = fixtures;
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(entities[0])
        .values(fixtures)
        .execute();
    }

    return app;
  }

  // public static async finish() {
  //   await getConnection()
  //     .createQueryBuilder()
  //     .delete()
  //     .from(User)
  //     .where("id = :id", { id: 1 })
  //     .execute();
  // }
}
