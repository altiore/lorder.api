import { Connection, createConnection } from 'typeorm';

import { RoleRepository } from './role';
import { User, UserRepository } from './user';
const config = require('../../ormconfig');

export class TypeormTestHelper {
  private connection: Connection;
  private repos;

  public async beforeAll(...args): Promise<any> {
    // 1. create connection
    this.connection = await createConnection(config);

    // 2. create repositories
    this.repos = args ? args.map(repo => this.connection.getCustomRepository(repo)) : [];
    return this.repos;

    // 3. load fixtures
  }

  public async afterAll() {
    // 1. remove fixtures
    await Promise.all(this.repos.map(async repo => await repo.delete({})));

    // 2. close connection
    await this.connection.close();
  }
}
