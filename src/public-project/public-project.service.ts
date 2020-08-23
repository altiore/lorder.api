import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { ProjectPub } from '@orm/entities/project-pub.entity';

@Injectable()
export class PublicProjectService extends TypeOrmCrudService<ProjectPub> {
  constructor(@InjectRepository(ProjectPub) repo) {
    super(repo);
  }
}
