import { EntityRepository, Repository } from 'typeorm';

import { UserWorkType } from './user-work-type.entity';

@EntityRepository(UserWorkType)
export class UserWorkTypeRepository extends Repository<UserWorkType> {}
