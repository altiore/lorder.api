import {
  Controller,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { ROLES } from '@orm/entities/role.entity';
import { TaskComment } from '@orm/entities/task-comment.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';

import { Auth, res, UserJWT } from '@common/decorators';

import { TaskCommentCreateDto } from './dto';
import { TaskCommentService } from './task-comment.service';

@ApiTags('task-comments (roles: user)')
@Crud({
  dto: {
    create: TaskCommentCreateDto,
    update: TaskCommentCreateDto,
  },
  model: {
    type: TaskComment,
  },
  params: {
    projectId: {
      disabled: true,
      primary: false,
      type: 'number',
    },
    taskId: {
      field: '"TaskComment"."taskId"',
      disabled: false,
      primary: false,
      type: 'number',
    },
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(TaskComment).getMany, ROLES.USER, ACCESS_LEVEL.RED)],
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      user: {
        eager: true,
      },
      'user.avatar': {
        eager: true,
      },
    },
  },
})
@Controller('projects/:projectId/tasks/:taskId/comments')
export class TaskCommentController implements CrudController<TaskComment> {
  // tslint:disable-next-line
  constructor(readonly service: TaskCommentService) {}

  get base(): CrudController<TaskComment> {
    return this;
  }

  @Auth(res(TaskComment).createOne, ROLES.USER, ACCESS_LEVEL.ORANGE)
  @Override()
  public async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: TaskCommentCreateDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @UserJWT() user: User
  ): Promise<TaskComment> {
    const task = await this.service.findTaskByIdAndCheckAccess(taskId, projectId, user, ACCESS_LEVEL.ORANGE);
    const result = await this.base.createOneBase(req, { ...dto, taskId: task.id, userId: user.id } as TaskComment);
    await this.service.updateCommentsCount(task.id);
    return result;
  }

  @Auth(res(TaskComment).deleteOne, ROLES.USER, ACCESS_LEVEL.RED)
  @Override()
  public async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: TaskComment,
    @UserJWT() user: User
  ): Promise<TaskComment> {
    const idEl = req?.parsed?.paramsFilter.find((el) => el.field === 'id');
    if (!idEl || !idEl.value) {
      throw new NotAcceptableException('Не удалось найти id комментария');
    }
    const taskComment = await this.service.findOnById(idEl.value);
    if (!taskComment) {
      throw new NotFoundException('комментарий не найден');
    }
    if (taskComment.userId !== user.id) {
      throw new ForbiddenException('Нельзя изменить чужой комментарий');
    }
    return this.base.updateOneBase(req, dto);
  }

  @Auth(res(TaskComment).deleteOne, ROLES.USER, ACCESS_LEVEL.ORANGE)
  @Override()
  public async deleteOne(@ParsedRequest() req: CrudRequest, @UserJWT() user: User): Promise<void | TaskComment> {
    const idEl = req?.parsed?.paramsFilter.find((el) => el.field === 'id');
    if (!idEl || !idEl.value) {
      throw new NotAcceptableException('Не удалось найти id комментария');
    }
    const taskComment = await this.service.findOnById(idEl.value);
    if (!taskComment) {
      throw new NotFoundException('комментарий не найден');
    }
    if (taskComment.userId !== user.id) {
      throw new ForbiddenException('Нельзя удалить чужой комментарий');
    }
    const result = await this.base.deleteOneBase(req);
    await this.service.updateCommentsCount(taskComment.taskId);
    return result;
  }
}
