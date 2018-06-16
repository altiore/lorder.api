// import { exec } from 'child_process';
import { createConnection, Connection } from 'typeorm';

import { User, UserRepository } from '../../@entities/user';
import { RoleRepository } from '../../@entities/role';

export class TypeormTestHelper {
  private connection: Connection;
  private repos;

  // private runMigrations() {
  //   function runCommand(command, callback) {
  //     const child = exec(command, (err, stdout, stderr) => {
  //       if (err != null) {
  //         return callback(err, null);
  //       } else if (typeof stderr !== 'string') {
  //         return callback(new Error(stderr), null);
  //       } else {
  //         return callback(null, stdout);
  //       }
  //     });
  //     child.on('close', code => {
  //       console.log('child ended with: ' + code);
  //     });
  //     child.on('error', err => {
  //       console.log('child errd with: ' + err);
  //     });
  //     child.stdout.on('data', d => {
  //       console.log(d);
  //     });
  //   }
  //
  //   return new Promise((resove, reject) => {
  //     runCommand(
  //       `${process.cwd()}/node_modules/.bin/ts-node ${process.cwd()}/node_modules/.bin/typeorm migration:run`,
  //       (err, stdout) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resove(stdout);
  //         }
  //       },
  //     );
  //   });
  // }

  public async beforeAll(...args): Promise<any> {
    // 1. set variables
    if (!process.env.TYPEORM_DATABASE) {
      require('dotenv').config();
    }
    process.env.TYPEORM_DATABASE = process.env.TEST_TYPEORM_DATABASE;
    process.env.TYPEORM_USERNAME = process.env.TEST_TYPEORM_USERNAME;
    process.env.TYPEORM_PASSWORD = process.env.TEST_TYPEORM_PASSWORD;

    // 2. run migrations
    // await this.runMigrations();

    // 3. create connection
    this.connection = await createConnection();

    // 4. create repositories
    this.repos = args ? args.map(repo => this.connection.getCustomRepository(repo)) : [];
    return this.repos;

    // 5. load fixtures
  }

  public async afterAll() {
    // 1. remove fixtures
    await Promise.all(this.repos.map(async (repo) => await repo.delete({})));

    // 2. close connection
    await this.connection.close();
  }

  public async createUser(userRepo: UserRepository, roleRepo: RoleRepository): Promise<User> {
    let userRole = await roleRepo.findOne({ where: { name: 'user' } });
    if (!userRole) {
      const newRole = await roleRepo.create({name: 'user'});
      userRole = await roleRepo.save(newRole);
    }
    const user = await userRepo.create({
      email: 'test@mail.com',
      status: 10,
      paymentMethod: 1,
    });
    user.roles = [userRole];
    return await userRepo.save(user);
  }
}
