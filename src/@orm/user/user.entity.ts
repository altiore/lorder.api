import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Role } from '../role/role.entity';
import { Project } from '../project/project.entity';
import { UserProjects } from '../user-projects/user-projects.entity';

@Entity()
export class User {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({
    unique: true,
    nullable: true,
    length: 254,
    transformer: {
      to: d => (d ? d.toLowerCase() : undefined),
      from: d => d,
    },
  })
  email: string;

  @ApiModelProperty()
  @Column({
    unique: true,
    nullable: true,
    length: 13,
    transformer: {
      to: d => (d ? d.replace(/[\D]/gi, '') : undefined),
      from: d => d,
    },
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

  @Column({ nullable: true, select: false })
  resetLink: string;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiModelProperty({ type: Role, isArray: true })
  @ManyToMany(type => Role, undefined, { eager: true, cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ApiModelProperty({ type: Project, isArray: true })
  @OneToMany(type => Project, project => project.owner)
  projects: Project[];

  @ApiModelProperty({ type: UserProjects, isArray: true })
  @OneToMany(type => UserProjects, userProjects => userProjects.memberId)
  userProjects: UserProjects[];
}
