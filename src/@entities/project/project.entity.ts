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
import * as moment from 'moment';

import { User } from '../user/user.entity';
import { Phase } from '../project-phase/phase.entity';
import { momentDateTransformer } from '../@columns/moment.date.transformer';

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
  @ManyToOne(type => User, undefined, { nullable: false })
  creator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, undefined, { nullable: false })
  updator: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.projects, { nullable: false })
  owner: User;

  @ApiModelProperty({ type: Phase, isArray: true })
  @OneToMany(type => Phase, phase => phase.project)
  phases: Phase[];
}
