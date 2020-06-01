import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ValidationError } from 'class-validator';
import { EntityManager, In } from 'typeorm';

import { ProjectPart } from '@orm/project-part/project-part.entity';

import { ValidationException } from '../@common/exceptions/validation.exception';

@Injectable()
export class ProjectPartService extends TypeOrmCrudService<ProjectPart> {
  constructor(@InjectRepository(ProjectPart) repo) {
    super(repo);
  }

  public async findManyByIds(ids: number[], projectId: number, manager: EntityManager): Promise<ProjectPart[]> {
    return await manager.find(ProjectPart, { where: { id: In(ids), projectId } });
  }

  public async checkCanRemove(projectPartId: number): Promise<any> {
    const usedCount = await this.repo.manager.count('task_project_parts_project_part', {
      where: {
        projectPartId,
      },
    });
    if (usedCount) {
      throw new ValidationException(
        [
          Object.assign(new ValidationError(), {
            constraints: {
              isUsedByTask: 'Вы не можете удалить часть проекта, в которой есть задачи',
            },
            property: 'id',
            value: projectPartId,
          }),
        ],
        'Вы не можете удалить часть проекта, в которой есть задачи'
      );
    }
  }
}
