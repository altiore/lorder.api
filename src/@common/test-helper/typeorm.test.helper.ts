import { exec } from 'child_process';
import { createConnection, Connection } from 'typeorm';

export class TypeormTestHelper {
  private connection: Connection;
  private repo;

  private runMigrations() {
    if (!process.env.TYPEORM_DATABASE) {
      require('dotenv').config();
    }
    process.env.TYPEORM_DATABASE = process.env.TEST_TYPEORM_DATABASE;
    process.env.TYPEORM_USERNAME = process.env.TEST_TYPEORM_USERNAME;
    process.env.TYPEORM_PASSWORD = process.env.TEST_TYPEORM_PASSWORD;
    function runCommand(command, callback) {
      const child = exec(command, (err, stdout, stderr) => {
        if (err != null) {
          return callback(err, null);
        } else if (typeof stderr !== 'string') {
          return callback(new Error(stderr), null);
        } else {
          return callback(null, stdout);
        }
      });
      child.on('close', code => {
        console.log('child ended with: ' + code);
      });
      child.on('error', err => {
        console.log('child errd with: ' + err);
      });
      child.stdout.on('data', d => {
        // console.log(d);
      });
    }

    return new Promise((resove, reject) => {
      runCommand(
        `${__dirname}/../../../node_modules/.bin/ts-node ${__dirname}/../../../node_modules/.bin/typeorm migration:run`,
        (err, stdout) => {
          if (err) {
            reject(err);
          } else {
            resove(stdout);
          }
        },
      );
    });
  }

  public async create<T>(repo): Promise<T> {
    // 1. run migrations
    await this.runMigrations();
    this.connection = await createConnection();
    return (this.repo = this.connection.getCustomRepository(repo));
  }

  public async cancel() {
    await this.repo.delete({});
    await this.connection.close();
  }
}
