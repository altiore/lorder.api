import { createHash } from 'crypto';
import { DeepPartial, EntityRepository, In, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Role } from '../role/role.entity';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // Испльзуется при входе по паролю
  public async findOneByEmail(email: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      try {
        return await this.findOne({
          loadEagerRelations: false,
          relations: ['avatar', 'roles'],
          select: ['id', 'email', 'status', 'defaultProjectId', 'displayName', 'password'],
          where: { email },
        });
      } catch (e) {
        throw e;
      }
    }
    return await this.findOne({ where: { email } });
  }

  // Используется при валидации JWT ключа
  public findOneActiveByEmail(email: string): Promise<User> {
    return this.findOneOrFail({ where: { email, status: 10 } });
  }

  public updateOne(user: User, data: DeepPartial<User>): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }

  public async createWithRoles(
    data: DeepPartial<User>,
    roles: Role[]
  ): Promise<{ user: User; password?: string }> {
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
    return this.createQueryBuilder()
      .select('User.createdAt', 'createdAt')
      .addSelect('User.defaultProjectId', 'defaultProjectId')
      .addSelect('User.email', 'email')
      .addSelect('User.id', 'id')
      .addSelect('User.paymentMethod', 'paymentMethod')
      .addSelect('User.status', 'status')
      .addSelect('User.tel', 'tel')
      .addSelect('User.updatedAt', 'updatedAt')
      .leftJoin('User.memberProjects', 'ProjectsWhereMember')
      .addSelect('COUNT(DISTINCT "ProjectsWhereMember"."projectId")', 'projectsCount')
      .leftJoin('user_roles', 'UserRoles', 'User.id=UserRoles.userId')
      .addSelect(
        '(SELECT "name" FROM role where id = COUNT(DISTINCT "UserRoles"."roleId"))',
        'role'
      )
      .addSelect('(SELECT "url" FROM media where id = "User"."avatarId")', 'avatar')
      .orderBy(`User.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .groupBy('User.id')
      .limit(count)
      .getRawMany();
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
