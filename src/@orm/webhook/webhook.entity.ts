import { ApiProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';

@Entity('webhook')
export class WebHook {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column('json')
  data!: object;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt!: Moment;
}
