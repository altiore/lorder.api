import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { STATUS_NAME } from '../../@domains/strategy';
import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { ProjectPart } from './project-part.entity';
import { Project } from './project.entity';
import { TaskComment } from './task-comment.entity';
import { TaskStatus } from './task-status.entity';
import { TaskType } from './task-type.entity';
import { UserTask } from './user-task.entity';
import { UserWork } from './user-work.entity';
import { User } from './user.entity';

@Entity()
@Index(['projectId', 'sequenceNumber'])
@Unique(['projectId', 'sequenceNumber'])
export class Task {
  static plainFields: (keyof Task)[] = [
    'id',
    'sequenceNumber',
    'projectId',
    'title',
    'description',
    'value',
    'source',
    'status',
    'statusTypeName',
    'typeId',
    'isArchived',
    'inProgress',
    'performerId',
    'createdById',
    'responsibleId',
  ];

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, update: false })
  sequenceNumber: number;

  @ApiProperty()
  @Column({ nullable: false })
  projectId: number;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project;

  // ApiModel does not work here due to circular dependency
  @ManyToOne((type) => Task, (m) => m.children)
  parentTask?: Task;

  // ApiModel does not work here due to circular dependency
  @OneToMany((type) => Task, (m) => m.parentTask)
  children?: Task[];

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiPropertyOptional()
  @Column('float', { nullable: false, default: 0 })
  value: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  source: string;

  @ApiPropertyOptional()
  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  statusTypeName: STATUS_NAME;

  @ManyToOne((t) => TaskStatus, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  statusType: TaskStatus;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  typeId: number;

  @ApiPropertyOptional()
  @ManyToOne(() => TaskType, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  type: TaskType;

  @Column('boolean', { default: false })
  isArchived: boolean = false;

  @Column('boolean', { default: false })
  inProgress: boolean = false;

  @ApiProperty()
  @Column({ nullable: true })
  performerId: number;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  performer: User;

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty()
  @Column({ nullable: true })
  createdById: number;

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  createdBy: User;

  @ApiProperty()
  @Column({ nullable: true })
  responsibleId: number;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  responsible: User;

  @OneToMany((type) => UserWork, (userWork) => userWork.task, { eager: false })
  userWorks: UserWork[];

  @OneToMany((type) => UserTask, (m) => m.task)
  userTasks: UserTask[];

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @OneToMany((type) => TaskComment, (m) => m.task)
  comments: TaskComment[];

  @ManyToMany((t) => ProjectPart, (p) => p.tasks, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  projectParts: ProjectPart[];

  @Column('int', { nullable: false, default: 0 })
  commentsCount: number;
}
