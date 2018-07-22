import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import { TaskType } from '../task-type/task-type.entity';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { UserProject } from '../user-project/user-project.entity';

@Entity()
export class Project {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty()
  @Column('int', { nullable: true })
  monthlyBudget: number;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User)
  creator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User)
  updator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.ownProjects, { nullable: false })
  owner: User;

  @ApiModelProperty({ type: Task, isArray: true })
  @OneToMany(type => Task, task => task.project)
  tasks: Task[];

  @ApiModelProperty({ type: TaskType, isArray: true })
  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.project)
  projectTaskTypes: ProjectTaskType[];

  @ApiModelProperty({ type: UserProject, isArray: true })
  @OneToMany(type => UserProject, userProject => userProject.project)
  projectMembers: UserProject[];
}
