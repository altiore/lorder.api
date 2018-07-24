import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserTask {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Ценность задачи в условных единицах
   */
  @ApiModelProperty()
  @Column()
  value: number;

  @ApiModelProperty()
  @Column()
  description: string;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  startAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  finishAt: Moment;

  /**
   * Может быть ссылкой на внешний сервис/ресурс
   */
  @ApiModelProperty()
  @Column()
  source: string;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.tasks, { nullable: false })
  user: User;

  @ApiModelProperty({ type: Task })
  @ManyToOne(type => Task, task => task.userTasks, { nullable: false })
  task: Task;
}
