import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class TaskComment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column('text')
  text!: string;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt!: Moment;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiProperty()
  @Column()
  userId!: number;

  @ApiProperty()
  @Column()
  taskId!: number;

  @Exclude()
  @ManyToOne(t => User, {
    nullable: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user!: User;

  @ApiProperty({ type: () => Task })
  @ManyToOne(t => Task, t => t.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  task!: Task;
}
