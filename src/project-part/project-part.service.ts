import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EntityManager, In } from 'typeorm';

import { ProjectPart } from '@orm/project-part/project-part.entity';

@Injectable()
export class ProjectPartService extends TypeOrmCrudService<ProjectPart> {
  constructor(@InjectRepository(ProjectPart) repo) {
    super(repo);
  }

  public async findManyByIds(ids: number[], projectId: number, manager: EntityManager): Promise<ProjectPart[]> {
    return await manager.find(ProjectPart, { where: { id: In(ids), projectId } });
  }
}
