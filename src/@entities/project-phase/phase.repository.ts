import { EntityRepository, Repository } from 'typeorm';

import { Phase } from './phase.entity';

@EntityRepository(Phase)
export class PhaseRepository extends Repository<Phase> {

  /** */

}