import { createHash } from 'crypto';
import { DeepPartial, EntityRepository, In, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Role } from '../role/role.entity';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Испльзуется при входе по паролю
   */
  public async findOneByEmail(email: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      try {
        return await this.findOne({
          loadEagerRelations: false,
          relations: ['roles'],
          select: ['email', 'status', 'password'],
          where: { email },
        });
      } catch (e) {
        throw e;
      }
    }
    return await this.findOne({ where: { email } });
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

  public findWithPagination({
    count = 20,
    skip = 0,
    orderBy = 'createdAt',
    order = 'desc',
  }: PaginationDto): Promise<User[]> {
    return this.find({
      order: { [orderBy]: order.toUpperCase() },
      skip,
      take: count,
    });
  }

  public findAllByIds(ids: number[]): Promise<User[]> {
    return this.find({ id: In(ids) });
  }

  public hashPassword(password) {
    return createHash('md5')
      .update(password)
      .digest('hex');
  }
}
