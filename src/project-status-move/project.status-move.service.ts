import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { ProjectRoleAllowedMove } from '@orm/project-role-allowed-move/project-role-allowed-move.entity';

@Injectable()
export class ProjectStatusMoveService extends TypeOrmCrudService<ProjectRoleAllowedMove> {
  constructor(@InjectRepository(ProjectRoleAllowedMove) repo) {
    super(repo);
  }
}
