import { ApiProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';

import { TaskStatus } from '../../task-status/task-status.entity';
import { ProjectRoleAllowedMove } from '../project-role-allowed-move/project-role-allowed-move.entity';

@Entity()
export class TaskStatusMove {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskStatus, m => m.fromMoves, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  from: TaskStatus;

  @ManyToOne(() => TaskStatus, m => m.toMoves, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  to: TaskStatus;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @OneToMany(() => ProjectRoleAllowedMove, m => m.taskStatusMove)
  allowedMoves: ProjectRoleAllowedMove[];
}
