import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult } from 'typeorm';

import { Role } from '@orm/role';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  constructor(@InjectRepository(Role) repo) {
    super(repo);
  }

  public deleteMany(ids: number[]): Promise<DeleteResult> {
    return this.repo.delete(ids);
  }
}
