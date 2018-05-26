import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';

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
}
