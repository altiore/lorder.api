import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  public findByIdentifier(identifier: string): Promise<User> {
    return this.findOneOrFail({ identifier });
  }

  public createEntity<T>(data: T | CreateUserDto): Promise<User> {
    const user = this.create(data);
    user.status = 1;
    user.identifier = user.identifier || user.email;
    return this.save(user);
  }

  public updateEntity(user: User, data: UpdateUserDto): Promise<User> {
    this.merge(user, data);
    return this.save(user);
  }

}