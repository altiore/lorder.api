import { EntityRepository, Repository } from 'typeorm';

import { WorkType } from './work-type.entity';

@EntityRepository(WorkType)
export class WorkTypeRepository extends Repository<WorkType> {}
