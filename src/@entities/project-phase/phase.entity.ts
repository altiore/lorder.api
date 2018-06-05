import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';

import { Project } from '../project/project.entity';
import { momentDateTransformer } from '../@columns/moment.date.transformer';

@Entity()
export class Phase {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column('int', { nullable: true })
  title: number;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: moment.Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: moment.Moment;

  @ApiModelProperty({ type: Project })
  @ManyToOne(() => Project, undefined, { nullable: false })
  project: Project;
}
