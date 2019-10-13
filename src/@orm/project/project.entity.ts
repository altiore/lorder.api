import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { ProjectPub } from '../project-pub/project-pub.entity';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { TaskType } from '../task-type/task-type.entity';
import { Task } from '../task/task.entity';
import { ACCESS_LEVEL } from '../user-project';
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
  @ManyToOne(() => User)
  creator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(() => User)
  updator: User;

  @ApiModelProperty()
  @Column({ nullable: false })
  ownerId: number;

  @ApiModelProperty({ type: User })
  @ManyToOne(() => User, user => user.ownProjects, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  owner: User;

  @ApiModelProperty({ type: Task, isArray: true })
  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => ProjectTaskType, projectTaskType => projectTaskType.project)
  projectTaskTypes: ProjectTaskType[];

  @OneToOne(() => ProjectPub, pub => pub.project)
  pub: ProjectPub;

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
  @OneToMany(() => UserProject, userProject => userProject.project)
  members: UserProject[];

  @ApiModelPropertyOptional({
    description: 'Access Level for current user in current project',
    type: UserProject,
  })
  accessLevel?: UserProject;

  @ApiModelPropertyOptional({ description: 'Время в секундах, потраченное на проект' })
  timeSum?: number;

  @ApiModelPropertyOptional({ description: 'Сумма всех оцененных задач в проекте' })
  valueSum?: number;

  isAccess(accessLevel: ACCESS_LEVEL) {
    return this.accessLevel && this.accessLevel.accessLevel >= accessLevel;
  }
}
