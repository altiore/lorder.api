import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan } from 'typeorm';

import { ListDto } from '../../../@common/dto';
import { Project } from '../../../@orm/project';
import { TaskLog, TaskLogRepository } from '../../../@orm/task-log';
import { User } from '../../../@orm/user';
import { ProjectTaskService } from '../project.task.service';

@Injectable()
export class TaskLogService {
  constructor(
    @InjectRepository(TaskLogRepository) private readonly taskLogRepo: TaskLogRepository,
    private readonly projectTaskService: ProjectTaskService
  ) {}

  public async findAll(
    project: Project,
    sequenceNumber: number,
    listDto: ListDto,
    user: User
  ): Promise<TaskLog[]> {
    const checkedTask = await this.projectTaskService.checkAccess(sequenceNumber, project, user);

    let beforeStartList = [];
    let beforeStartCount = 0;
    if (listDto.startId) {
      const [beforeStartListFromDB, beforeStartCountFromDB] = await this.taskLogRepo.findAndCount({
        loadRelationIds: true,
        order: { [listDto.orderBy || 'id']: listDto.order ? listDto.order.toUpperCase() : 'DESC' },
        where: {
          id: MoreThan(listDto.startId),
          task: checkedTask,
        },
      });
      beforeStartList = beforeStartListFromDB;
      beforeStartCount = beforeStartCountFromDB;
    }

    const take = listDto.count - beforeStartCount;

    const whereForAfter: any = {
      task: checkedTask,
    };
    if (listDto.endId) {
      whereForAfter.id = LessThan(listDto.endId);
    }
    let afterEndList = [];
    if (take > 0) {
      afterEndList = await this.taskLogRepo.find({
        loadRelationIds: true,
        order: { [listDto.orderBy || 'id']: listDto.order ? listDto.order.toUpperCase() : 'DESC' },
        take,
        where: whereForAfter,
      });
    }
    return [...beforeStartList, ...afterEndList];
  }
}
