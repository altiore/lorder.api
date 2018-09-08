import { createHash } from 'crypto';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

import { Role } from '../role/role.entity';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Испльзуется при входе по паролю
   */
  public findOneByEmail(email: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      return this.findOne({
        select: ['email', 'status', 'password'],
        where: { email },
      });
    }
    return this.findOne({ where: { email } });
  }

  /**
   * Используется при валидации JWT ключа
   */
  public findOneActiveByEmail(email: string): Promise<User> {
    return this.findOneOrFail({ where: { email, status: 10 } });
  }

  public updateOne(user: User, data: DeepPartial<User>): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }

  public async createWithRoles(data: DeepPartial<User>, roles: Role[]): Promise<{ user: User; password?: string }> {
    const user = this.create(data);
    // создаваемый пользователь всегда неактивен
    user.status = 1;
    user.roles = roles;
    let password;
    if (user.password) {
      password = this.hashPassword(user.password);
      user.password = password;
    }
    await this.save(user);
    delete user.password;
    return { user, password };
  }

  public isPasswordValid(user: User, password: string): boolean {
    return this.hashPassword(password) === user.password;
  }

  public isStatusActive(user: User): boolean {
    return user.status === 10;
  }

  public hashPassword(password) {
    return createHash('md5')
      .update(password)
      .digest('hex');
  }
}
