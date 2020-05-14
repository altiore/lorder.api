import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { ProjectPart } from '@orm/project-part/project-part.entity';

@Injectable()
export class ProjectPartService extends TypeOrmCrudService<ProjectPart> {
  constructor(@InjectRepository(ProjectPart) repo) {
    super(repo);
  }
}
