import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  findByIdentifier(identifier: string) {
    return this.findOne({ identifier });
  }

}