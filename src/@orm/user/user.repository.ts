import { EntityRepository, Repository } from 'typeorm';
import { createHash } from 'crypto';
const generator = require('generate-password');

import { User } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { Role } from '../role/role.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Испльзуется при входе по паролю
   */
  public findOneByEmail(email: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      return this.findOne({
        where: { email },
        select: ['email', 'status', 'password'],
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

  public async activateByResetLink(resetLink: string): Promise<User> {
    const user = await this.findOneOrFail({ where: { resetLink } });
    user.status = 10;
    user.resetLink = null;
    return await this.save(user);
  }

  public updateEntity(user: User, data: UpdateUserDto): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }

  public async createWithRoles(data: CreateUserDto, roles: Role[]): Promise<{ user: User; password?: string }> {
    const user = this.create(data);
    // создаваемый пользователь всегда неактивен
    user.status = 1;
    user.roles = roles;
    let password;
    if (!user.password) {
      password = this.generatePassword();
      user.password = this.hashPassword(password);
    }
    await this.save(user);
    delete user.password;
    return { user, password };
  }

  public async validatePassword({ email, password }: LoginUserDto): Promise<User | false> {
    const user = await this.findOneByEmail(email, true);
    const isValid = this.hashPassword(password) === user.password;
    delete user.password;
    return isValid && user;
  }

  private generatePassword() {
    return generator.generate({
      length: 12,
      numbers: true,
    });
  }

  private hashPassword(password) {
    return createHash('md5')
      .update(password)
      .digest('hex');
  }
}
