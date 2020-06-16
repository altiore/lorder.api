import { ApiProperty } from '@nestjs/swagger';

import { Moment } from 'moment';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { User } from '../user/user.entity';

@Index(['userId', 'device'])
@Unique(['userId', 'device'])
@Unique(['refreshToken'])
@Entity()
export class Session {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ManyToOne(t => User, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  userAgent: string;

  @Column()
  referer: string;

  @Column()
  acceptLanguage: string;

  @Index()
  @Column()
  device: string;

  @Index()
  @Column()
  refreshToken: string;

  @Column('json')
  headers: object;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;
}
