import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Project } from '../project/project.entity';
import { Role } from '../role/role.entity';
import { UserProject } from '../user-project/user-project.entity';
import { UserTask } from '../user-task/user-task.entity';

@Entity()
export class User {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({
    length: 254,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.toLowerCase() : undefined),
    },
    unique: true,
  })
  email: string;

  @ApiModelProperty()
  @Column({
    length: 13,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.replace(/[\D]/gi, '') : undefined),
    },
    unique: true,
  })
  tel: string;

  @ApiModelProperty()
  @Column('int')
  status: number;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @Column({ nullable: true, select: false })
  password: string;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiModelProperty({ type: Role, isArray: true })
  @ManyToMany(() => Role, undefined, { eager: true, cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ApiModelProperty({ type: Project, isArray: true })
  @OneToMany(type => Project, project => project.owner)
  ownProjects: Project[];

  @ApiModelProperty({ type: UserProject, isArray: true })
  @OneToMany(type => UserProject, userProject => userProject.member)
  memberProjects: UserProject[];

  @ApiModelProperty({ type: UserProject, isArray: true })
  @OneToMany(type => UserProject, userProject => userProject.member)
  invitedMembers: UserProject[];

  @ApiModelProperty({ type: UserTask, isArray: true })
  @OneToMany(type => UserTask, userTask => userTask.user)
  tasks: UserTask[];
}
