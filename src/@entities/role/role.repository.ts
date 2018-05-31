import { EntityRepository, Repository } from 'typeorm';

import { Role } from '../role';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  public findByName(name: 'user' | 'admin' | 'super-admin') {
    return this.findOneOrFail({ name });
  }

  public findUserRole() {
    return this.findByName('user');
  }

  public findAdminRole() {
    return this.findByName('admin');
  }

  public findSuperAdminRole() {
    return this.findByName('super-admin');
  }
}
