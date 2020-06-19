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

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { ProjectPart } from '../project-part/project-part.entity';
import { Project } from '../project/project.entity';
import { TaskComment } from '../task-comment/task-comment.entity';
import { TaskStatus } from '../task-status/task-status.entity';
import { TaskType } from '../task-type/task-type.entity';
import { UserTask } from '../user-task/user-task.entity';
import { UserWork } from '../user-work/user-work.entity';
import { User } from '../user/user.entity';

export enum TASK_SIMPLE_STATUS {
  JUST_CREATED = 0,
  TO_DO = 1,
  IN_PROGRESS = 2,
  IN_TESTING = 3,
  DONE = 4,
}

export enum TASK_STATUS_TYPE {
  CREATING = 'creating',
  ARCHITECT_ESTIMATION = 'architect-estimation',
  PROF_ESTIMATION = 'prof-estimation',
  READY_TO_DO = 'ready-to-do',
  IN_PROGRESS = 'in-progress',
  PROF_REVIEW = 'prof-review',
  TESTING = 'testing',
  ARCHITECT_REVIEW = 'architect-review',
  PROF_ESTIMATION_2 = 'prof-estimation-2',
  ARCHITECT_ESTIMATION_2 = 'architect-estimation-2',
  DONE = 'done',
}

@Entity()
@Index(['projectId', 'sequenceNumber'])
@Unique(['projectId', 'sequenceNumber'])
export class Task {
  static statuses: { [key in keyof typeof TASK_SIMPLE_STATUS]: TASK_SIMPLE_STATUS } = {
    JUST_CREATED: 0,
    TO_DO: 1,
    IN_PROGRESS: 2,
    IN_TESTING: 3,
    DONE: 4,
  };

  // TODO: удалить, когда с UI будет приходить правильное значение
  static statusToName(status: number): TASK_STATUS_TYPE {
    if (![0, 1, 2, 3, 4].includes(status)) {
      throw new Error('Недопустимое значение');
    }

    return [
      TASK_STATUS_TYPE.CREATING,
      TASK_STATUS_TYPE.READY_TO_DO,
      TASK_STATUS_TYPE.IN_PROGRESS,
      TASK_STATUS_TYPE.TESTING,
      TASK_STATUS_TYPE.DONE,
    ][status];
  }

  static statusTypeNameToSimpleStatus(statusTypeName: TASK_STATUS_TYPE): TASK_SIMPLE_STATUS {
    return {
      [TASK_STATUS_TYPE.CREATING]: 0,
      [TASK_STATUS_TYPE.ARCHITECT_ESTIMATION]: 0,
      [TASK_STATUS_TYPE.PROF_ESTIMATION]: 0,
      [TASK_STATUS_TYPE.READY_TO_DO]: 1,
      [TASK_STATUS_TYPE.IN_PROGRESS]: 2,
      [TASK_STATUS_TYPE.PROF_REVIEW]: 3,
      [TASK_STATUS_TYPE.TESTING]: 3,
      [TASK_STATUS_TYPE.ARCHITECT_REVIEW]: 3,
      [TASK_STATUS_TYPE.PROF_ESTIMATION_2]: 3,
      [TASK_STATUS_TYPE.ARCHITECT_ESTIMATION_2]: 3,
      [TASK_STATUS_TYPE.DONE]: 4,
    }[statusTypeName];
  }

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
  @ManyToOne(() => Project, project => project.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project;

  // ApiModel does not work here due to circular dependency
  @ManyToOne(type => Task, m => m.children)
  parentTask?: Task;

  // ApiModel does not work here due to circular dependency
  @OneToMany(type => Task, m => m.parentTask)
  children?: Task[];

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  value: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  source: string;

  @ApiPropertyOptional()
  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  statusTypeName: TASK_STATUS_TYPE;

  @ManyToOne(t => TaskStatus, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  statusType: TaskStatus;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  typeId: number;

  @ApiPropertyOptional()
  @ManyToOne(() => TaskType, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  type: TaskType;

  @Column('boolean', { default: false })
  isArchived: boolean = false;

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

  @OneToMany(type => UserWork, userWork => userWork.task, { eager: false })
  userWorks: UserWork[];

  @OneToMany(type => UserTask, m => m.task)
  userTasks: UserTask[];

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  // TODO: can be removed. Redundant and exists in task-log table
  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @OneToMany(type => TaskComment, m => m.task)
  comments: TaskComment[];

  @ManyToMany(t => ProjectPart, p => p.tasks, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  projectParts: ProjectPart[];
}
