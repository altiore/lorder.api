import { EntityRepository, Repository } from 'typeorm';
import { createHash } from 'crypto';

import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '../role';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public findOneByEmail(email: string, withPassword: boolean = false): Promise<User> {
    if (withPassword) {
      return this.findOne({
        where: { email },
        select: ['email', 'status', 'password'],
      });
    }
    return this.findOne({ where: { email } });
  }

  public async findOneByResetLink(resetLink: string): Promise<User> {
    const user = await this.findOneOrFail({ where: { resetLink } });
    user.status = 10;
    user.resetLink = null;
    return await this.save(user);
  }

  public createEntity(data: CreateUserDto, roles: Role[] = []): Promise<User> {
    const user = this.create(data);
    user.status = 1;
    if (roles.length) {
      user.roles = roles;
    }
    if (!user.password) {
      user.password = createHash('md5')
        .update('123456789')
        .digest('hex');
    }
    return this.save(user);
  }

  public updateEntity(user: User, data: UpdateUserDto): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }
}
