import { EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { User } from '../user/user.entity';

import { ProjectDto } from './dto';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public async findOneByProjectId(projectId: number): Promise<Project> {
    return await this.findOne({
      relations: ['pub'],
      where: { id: projectId },
    });
  }

  public createByUser(data: ProjectDto, creator: User): Promise<Project> {
    const project = this.create(data);
    project.creator = creator;
    project.updator = creator;
    project.owner = creator;
    return this.save(project);
  }

  public async findAllWithPagination(paginationDto: PaginationDto): Promise<Project[]> {
    return this.find({
      order: { [paginationDto.orderBy]: paginationDto.order.toUpperCase() },
      skip: paginationDto.skip,
      take: paginationDto.count,
    });
  }
}
