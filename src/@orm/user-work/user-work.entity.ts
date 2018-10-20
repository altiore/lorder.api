import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { TaskType } from '../task-type/task-type.entity';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserWork {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ nullable: true })
  description: string;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  startAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @Column({ ...momentDateTransformer, type: 'timestamp', nullable: true })
  finishAt: Moment;

  /**
   * Ценность задачи в условных единицах
   */
  @ApiModelProperty()
  @Column({ nullable: true })
  value: number;

  /**
   * Может быть ссылкой на внешний сервис/ресурс
   */
  @ApiModelProperty()
  @Column({ nullable: true })
  source: string;

  @ManyToOne(() => User, user => user.works, { nullable: false })
  user: User;

  @ApiModelProperty({ type: Task })
  @ManyToOne(() => Task, task => task.userWorks, { nullable: false })
  task: Task;

  @ApiModelProperty({ type: TaskType })
  @ManyToOne(() => TaskType, { eager: true })
  taskType: TaskType;

  @ApiModelProperty({ type: Number })
  get taskId() {
    return this.task ? this.task.id : null;
  }

  @ApiModelProperty({ type: Number })
  get taskTypeId() {
    return this.taskType ? this.taskType.id : null;
  }

  @ApiModelProperty({ type: Number })
  get projectId() {
    return this.task && this.task.project ? this.task.project.id : null;
  }
}
