import { Connection, createConnection } from 'typeorm';

const config = require('../../ormconfig');

/**
 * @deprecated use import { TypeormFixtures } from 'typeorm-fixtures'; instead
 */
export class TypeormTestHelper {
  private connection: Connection;
  private repos;

  public async beforeAll(...args): Promise<any> {
    // 1. create connection
    this.connection = await createConnection(config);



    // 2. create repositories
    this.repos = args ? args.map((repo) => this.connection.getCustomRepository(repo)) : [];
    return this.repos;
  }

  public async afterAll() {
    // 1. close connection
    await this.connection.close();
  }
}
