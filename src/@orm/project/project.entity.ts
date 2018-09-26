import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { TaskType } from '../task-type/task-type.entity';
import { Task } from '../task/task.entity';
import { UserProject } from '../user-project/user-project.entity';
import { User } from '../user/user.entity';

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

  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.project)
  projectTaskTypes: ProjectTaskType[];

  @ApiModelPropertyOptional({ type: TaskType, isArray: true })
  get taskTypes() {
    return this.projectTaskTypes &&
      this.projectTaskTypes.length &&
      this.projectTaskTypes[0] &&
      this.projectTaskTypes[0].taskType
      ? this.projectTaskTypes.map(ptt => ptt.taskType)
      : [];
  }

  @ApiModelPropertyOptional({ type: UserProject, isArray: true })
  @OneToMany(type => UserProject, userProject => userProject.project)
  members: UserProject[];

  @ApiModelPropertyOptional({ type: UserProject, description: 'Access Level for current user in current project' })
  accessLevel?: UserProject;
}
