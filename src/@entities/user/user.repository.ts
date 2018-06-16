import { EntityRepository, Repository } from 'typeorm';
import { createHash } from 'crypto';

import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '../role';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findByIdentifier(username: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      return this.findOneOrFail({ where: { username }, select: ['username', 'email', 'status', 'password'] });
    }
    return this.findOneOrFail({ where: { username } });
  }

  public createEntity<T>(data: T | CreateUserDto, roles: Role[] = []): Promise<User> {
    const user = this.create(data);
    user.status = 1;
    user.email = user.email || user.username;
    if (roles.length) {
      user.roles = roles;
    }
    if (!user.password) {
      user.password = createHash('md5').update('123456789').digest('hex');
    }
    return this.save(user);
  }

  public updateEntity(user: User, data: UpdateUserDto): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }
}
