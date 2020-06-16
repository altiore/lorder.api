import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Task })
  @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  task: Task;

  @ApiProperty()
  @Column({ type: 'enum', enum: TASK_CHANGE_TYPE, default: TASK_CHANGE_TYPE.UPDATE })
  changeType: TASK_CHANGE_TYPE;

  @ApiPropertyOptional()
  @Column('simple-json', { default: {}, nullable: false })
  prevVersion: Partial<Task>;

  @ApiPropertyOptional()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  createdBy: User;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;
}
