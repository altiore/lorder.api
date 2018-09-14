import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { IdDto } from '../@common/dto';
import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { EmailDto, User } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository) {}

  public findAll(user: User): Promise<Partial<Project>[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public async findOne(id: number, user: User): Promise<Project> {
    try {
      return (await this.projectRepo.findOneByOwner(id, user)) as Project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }

  public remove(id: number, user: User): Promise<DeleteResult> {
    return this.projectRepo.delete({ id, owner: user });
  }
}
