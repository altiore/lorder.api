import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { ROLES } from '@orm/role';
import { TaskComment } from '@orm/task-comment/task-comment.entity';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';

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
    deleteOneBase: {
      decorators: [Auth(res(TaskComment).deleteOne, ROLES.USER, ACCESS_LEVEL.ORANGE)],
    },
    updateOneBase: {
      decorators: [Auth(res(TaskComment).updateOne, ROLES.USER, ACCESS_LEVEL.ORANGE)],
    },
  },
  query: {
    alwaysPaginate: true,
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
    return this.base.createOneBase(req, { ...dto, taskId: task.id, userId: user.id } as TaskComment);
  }
}
