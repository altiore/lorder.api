import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectRole } from '../../project/role/project-role.entity';
import { TaskStatusMove } from '../task-status-move/task-status-move.entity';

export enum TASK_STATUS_MOVE_TYPE {
  PREPARING = 'preparing',
  TO_DO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  DONE = 'done',
}

@Entity()
export class ProjectRoleAllowedMove {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public projectRoleId!: number;

  @ManyToOne(type => ProjectRole, m => m.allowedMoves)
  public projectRole!: ProjectRole;

  @Column()
  public taskStatusMoveId!: number;

  @ManyToOne(type => TaskStatusMove, m => m.allowedMoves)
  public taskStatusMove!: TaskStatusMove;

  // Тип задачи в контексте текущей роли
  @Column('enum', { enum: TASK_STATUS_MOVE_TYPE })
  public type!: TASK_STATUS_MOVE_TYPE;
}
