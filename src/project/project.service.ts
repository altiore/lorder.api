import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { User } from '../@orm/user';
import { ProjectPaginationDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository) {}

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

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }

  public remove(id: number, user: User): Promise<DeleteResult> {
    return this.projectRepo.delete({ id, owner: user });
  }

  public async findWithPagination(pagesDto: ProjectPaginationDto): Promise<Partial<Project>[]> {
    try {
      return this.projectRepo.findWithPagination(pagesDto);
    } catch (e) {
      throw new NotFoundException('Проекты не найдены');
    }
  }
}
