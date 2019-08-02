import { EntityRepository, In, Repository } from 'typeorm';

import { Specialty } from './specialty.entity';

@EntityRepository(Specialty)
export class SpecialtyRepository extends Repository<Specialty> {
  public findByName(name: Specialty) {
    return this.findOneOrFail({ where: { name } });
  }

  public findByNames(names: Specialty[]): Promise<Specialty[]> {
    return this.find({ where: { name: In(names) } });
  }
}
