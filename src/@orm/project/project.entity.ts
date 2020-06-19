import { NotAcceptableException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { ProjectPart } from '../project-part/project-part.entity';
import { ProjectPub } from '../project-pub/project-pub.entity';
import { ITaskMove } from '../project-role-allowed-move/project-role-allowed-move.entity';
import { ProjectRole } from '../project-role/project-role.entity';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { Task } from '../task/task.entity';
import { ACCESS_LEVEL } from '../user-project/user-project.consts';
import { UserProject } from '../user-project/user-project.entity';
import { User } from '../user/user.entity';

export enum PROJECT_TYPE {
  SOCIALLY_USEFUL = 'socially_useful',
  PERSONALLY_USEFUL = 'personally_useful',
}

export enum PROJECT_STRATEGY {
  ADVANCED = 'ADVANCED',
  SIMPLE = 'SIMPLE',
  DOUBLE_CHECK = 'DOUBLE_CHECK',
}

export interface ITaskColumn {
  name: string;

  moves: ITaskMove[];

  statusFrom: number;
  statusTo: number;
}

@Entity()
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  desc?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  slogan?: string;

  @ApiProperty()
  @Column('int', { nullable: true })
  monthlyBudget: number;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  creator: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  updator: User;

  @ApiProperty({ enum: PROJECT_TYPE })
  @Column('enum', { enum: PROJECT_TYPE, nullable: false, default: PROJECT_TYPE.SOCIALLY_USEFUL })
  type: PROJECT_TYPE;

  @ApiProperty({ enum: PROJECT_STRATEGY })
  @Column('enum', { enum: PROJECT_STRATEGY, nullable: false, default: PROJECT_STRATEGY.SIMPLE })
  strategy: PROJECT_STRATEGY;

  @ApiProperty()
  @Column({ nullable: false })
  ownerId: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, m => m.ownProjects, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  owner: User;

  @ApiProperty({ type: Task, isArray: true })
  @OneToMany(() => Task, m => m.project)
  tasks: Task[];

  @ApiPropertyOptional({ type: ProjectTaskType })
  @OneToOne(() => ProjectTaskType, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  defaultTaskType: ProjectTaskType;

  @OneToMany(() => ProjectTaskType, m => m.project)
  projectTaskTypes: ProjectTaskType[];

  @OneToOne(() => ProjectPub, m => m.project)
  pub: ProjectPub;

  @ApiPropertyOptional({ type: UserProject, isArray: true })
  @OneToMany(() => UserProject, m => m.project)
  members: UserProject[];

  @ApiPropertyOptional({ type: () => ProjectRole, isArray: true })
  @OneToMany(() => ProjectRole, m => m.project)
  roles: ProjectRole[];

  @ApiPropertyOptional({
    description: 'Access Level for current user in current project',
    type: UserProject,
  })
  accessLevel?: Partial<UserProject>;

  @ApiPropertyOptional({ description: 'Время в секундах, потраченное на проект' })
  timeSum?: number;

  @ApiPropertyOptional({ description: 'Сумма всех оцененных задач в проекте' })
  valueSum?: number;

  @ApiPropertyOptional({ type: () => ProjectPart, isArray: true })
  @OneToMany(() => ProjectPart, m => m.project)
  parts: ProjectPart[];

  taskColumns?: ITaskColumn[];

  isAccess(accessLevel: ACCESS_LEVEL) {
    if (!this.accessLevel) {
      throw new NotAcceptableException('AccessLevel MUST be found for checked project for check!');
    }
    return this.accessLevel.accessLevel >= accessLevel;
  }
}
