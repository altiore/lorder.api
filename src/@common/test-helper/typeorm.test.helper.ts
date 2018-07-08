// import { exec } from 'child_process';
import { createConnection, Connection } from 'typeorm';

import { User, UserRepository } from '../../@orm/user';
import { RoleRepository } from '../../@orm/role';

export class TypeormTestHelper {
  private connection: Connection;
  private repos;

  public async beforeAll(...args): Promise<any> {
    // 1. set variables
    if (!process.env.TYPEORM_DATABASE) {
      require('dotenv').config();
    }
    process.env.TYPEORM_DATABASE = process.env.TEST_TYPEORM_DATABASE;
    process.env.TYPEORM_USERNAME = process.env.TEST_TYPEORM_USERNAME;
    process.env.TYPEORM_PASSWORD = process.env.TEST_TYPEORM_PASSWORD;

    // 2. create connection
    this.connection = await createConnection();

    // 3. create repositories
    this.repos = args ? args.map(repo => this.connection.getCustomRepository(repo)) : [];
    return this.repos;

    // 4. load fixtures
  }

  public async afterAll() {
    // 1. remove fixtures
    await Promise.all(this.repos.map(async repo => await repo.delete({})));

    // 2. close connection
    await this.connection.close();
  }

  public async createUser(userRepo: UserRepository, roleRepo: RoleRepository): Promise<User> {
    let userRole = await roleRepo.findOne({ where: { name: 'user' } });
    if (!userRole) {
      const newRole = await roleRepo.create({ name: 'user' });
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
