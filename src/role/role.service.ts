import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { DeleteResult } from 'typeorm';

import { RoleFlow } from '@orm/role-flow';

@Injectable()
export class RoleService extends TypeOrmCrudService<RoleFlow> {
  constructor(@InjectRepository(RoleFlow) repo) {
    super(repo);
  }

  public deleteMany(ids: number[]): Promise<DeleteResult> {
    return this.repo.delete(ids);
  }

  public getOneById(id: string): Promise<RoleFlow> {
    return this.repo.findOne(id);
  }

  public getAllowedByProject(roles: string[]) {
    return this.repo.find({
      where: { id: roles },
    });
  }
}
