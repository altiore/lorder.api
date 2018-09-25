import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { User } from '../@orm/user';
import { ACCESS_LEVEL, UserProjectRepository } from '../@orm/user-project';
import { ProjectPaginationDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository
  ) {}

  public findAllByUser(user: User): Promise<Partial<Project>[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public async findOne(id: number, user: User): Promise<Project> {
    try {
      return (await this.projectRepo.findOneByOwner(id, user)) as Project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async create(data: ProjectDto, user: User): Promise<Project> {
    const project = await this.projectRepo.createByUser(data, user);
    await this.userProjectRepo.addToProject(project, user, user, ACCESS_LEVEL.VIOLET, 1);
    return project;
  }

  public remove(id: number, user: User): Promise<DeleteResult> {
    return this.projectRepo.delete({ id, owner: user });
  }

  public async findWithPaginationByUser(pagesDto: ProjectPaginationDto, user: User): Promise<Partial<Project>[]> {
    if (user.isSuperAdmin) {
      return this.projectRepo.findAllWithPagination(pagesDto, user);
    } else {
      return this.projectRepo.findWithPaginationByUser(pagesDto, user);
    }
  }
}
