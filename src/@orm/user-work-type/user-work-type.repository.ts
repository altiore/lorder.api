import { EntityRepository, Repository } from 'typeorm';

import { UserWorkType } from '../entities/user-work-type.entity';

@EntityRepository(UserWorkType)
export class UserWorkTypeRepository extends Repository<UserWorkType> {}
