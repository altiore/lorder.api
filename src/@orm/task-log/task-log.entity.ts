import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

export enum TASK_CHANGE_TYPE {
  CREATE = 'create',
  UPDATE = 'update',
  MOVE = 'move',
  ARCHIVE = 'archive',
  DELETE = 'delete',
}

@Entity()
export class TaskLog {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: Task })
  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  task: Task;

  @ApiModelProperty()
  @Column({ type: 'enum', enum: TASK_CHANGE_TYPE, default: TASK_CHANGE_TYPE.UPDATE })
  changeType: number;

  @ApiModelProperty()
  @Column('simple-json', { nullable: true })
  prevVersion: Partial<Task>;

  @ApiModelProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiModelProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  createdBy: User;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;
}
