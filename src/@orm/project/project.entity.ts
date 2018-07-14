import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { User } from '../user/user.entity';
import { Task } from '../task/task.entity';
import {Role} from '../role/role.entity';
import {TaskType} from '../task-type';
import {ProjectTaskType} from '../project-task-type/project-task-type.entity';

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
  createdAt: moment.Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: moment.Moment;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User)
  creator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User)
  updator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.projects, { nullable: false })
  owner: User;

  @ApiModelProperty({ type: Task, isArray: true })
  @OneToMany(type => Task, task => task.project)
  tasks: Task[];

    @ApiModelProperty({ type: TaskType, isArray: true })
    @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.tasktype)
    projectTaskTypes: ProjectTaskType[];

}
