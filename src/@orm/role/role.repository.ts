import { EntityRepository, In, Repository } from 'typeorm';

import { Role, ROLES } from '../entities/role.entity';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  public findByName(name: ROLES) {
    return this.findOneOrFail({ name });
  }

  public findByNames(names: ROLES[]): Promise<Role[]> {
    return this.find({ where: { name: In(names) } });
  }

  public findUserRole(): Promise<Role> {
    return this.findByName(ROLES.USER);
  }

  public findAdminRole(): Promise<Role> {
    return this.findByName(ROLES.ADMIN);
  }

  public findSuperAdminRole(): Promise<Role> {
    return this.findByName(ROLES.SUPER_ADMIN);
  }

  public findRolesByName(name: ROLES): Promise<Role[]> {
    if (name === ROLES.SUPER_ADMIN) {
      return this.findSuperAdminRoles();
    }
    if (name === ROLES.ADMIN) {
      return this.findAdminRoles();
    }
    return this.findUserRoles();
  }

  public findUserRoles(): Promise<Role[]> {
    return this.findByNames([ROLES.USER]);
  }

  public findAdminRoles(): Promise<Role[]> {
    return this.findByNames([ROLES.USER, ROLES.ADMIN]);
  }

  public findSuperAdminRoles(): Promise<Role[]> {
    return this.findByNames([ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }
}
