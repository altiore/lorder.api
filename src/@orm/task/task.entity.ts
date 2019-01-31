import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

import { Project } from '../project/project.entity';
import { TaskType } from '../task-type/task-type.entity';
import { UserWork } from '../user-work/user-work.entity';
import { User } from '../user/user.entity';

@Entity()
@Tree('closure-table')
export class Task {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ nullable: false })
  projectId: number;

  @ApiModelProperty({ type: Project })
  @ManyToOne(() => Project, project => project.tasks, { nullable: false })
  project: Project;

  // ApiModel does not work here due to circular dependency
  @TreeParent()
  parent?: Task;

  // ApiModel does not work here due to circular dependency
  @TreeChildren()
  children?: Task[];

  @ApiModelProperty()
  @Column({ nullable: false })
  title: string;

  @ApiModelProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  value: number;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  source: string;

  @ApiModelPropertyOptional()
  @Column({ default: 0 })
  status: number;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  typeId: number;

  @ApiModelPropertyOptional()
  @ManyToOne(() => TaskType, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  type: TaskType;

  @Column('boolean', { default: false })
  isArchived: boolean = false;

  @ApiModelProperty()
  @Column({ nullable: true })
  performerId: number;

  @ApiModelProperty({ type: User })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  performer: User;

  @OneToMany(type => UserWork, userWork => userWork.task, { eager: false })
  userWorks: UserWork[];

  @ManyToMany(type => User, user => user.tasks)
  users: User[];
}
