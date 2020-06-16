import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { User } from '../user/user.entity';
import { ProjectDto } from './dto';
import { Project, PROJECT_TYPE } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public async findOneByProjectId(projectId: number): Promise<Project> {
    return await this.findOne({
      relations: ['pub'],
      where: { id: projectId },
    });
  }

  public createByUser(data: ProjectDto, creator: User, manager?: EntityManager): Promise<Project> {
    const curManager = manager || this.manager;
    const project = curManager.create(Project, data);
    project.creator = creator;
    project.updator = creator;
    project.owner = creator;
    project.type = data.type || PROJECT_TYPE.SOCIALLY_USEFUL;
    return curManager.save(project);
  }

  public async findAllWithPagination(paginationDto: PaginationDto): Promise<Project[]> {
    return this.find({
      order: { [paginationDto.orderBy]: paginationDto.order.toUpperCase() },
      skip: paginationDto.skip,
      take: paginationDto.count,
    });
  }
}
