import { ApiProperty } from '@nestjs/swagger';

import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { User } from '../user/user.entity';

@Entity('user_log')
export class UserLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @Column('json', { nullable: false })
  prevUserData!: Partial<User>;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;
}
