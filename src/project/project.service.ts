import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { User } from '../@orm/user';
import { ACCESS_LEVEL, UserProjectRepository } from '../@orm/user-project';
import { ProjectPaginationDto } from './@dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository
  ) {}

  public async findOne(id: number): Promise<Project> {
    try {
      return await this.projectRepo.findOneBySuperAdmin(id);
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async findOneByMember(projectId: number, user: User): Promise<Project> {
    try {
      return await this.projectRepo.findOneByUser(projectId, user);
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async create(data: ProjectDto, user: User): Promise<Project> {
    const project = await this.projectRepo.createByUser(data, user);
    await this.userProjectRepo.addToProject(project, user, user, ACCESS_LEVEL.VIOLET);
    return project;
  }

  public async remove(id: number): Promise<number> {
    await this.projectRepo.delete(id);
    return id;
  }

  public async findWithPaginationByUser(pagesDto: ProjectPaginationDto, user: User): Promise<Partial<Project>[]> {
    if (user.isSuperAdmin) {
      return this.projectRepo.findAllWithPagination(pagesDto, user);
    } else {
      return this.projectRepo.findWithPaginationByUser(pagesDto, user);
    }
  }
}
