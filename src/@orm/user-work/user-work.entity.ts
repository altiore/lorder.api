import { ApiProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { TaskType } from '../task-type/task-type.entity';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserWork {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @Column({ ...momentDateTransformer, type: 'timestamp', nullable: false })
  startAt: Moment;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @Column({ ...momentDateTransformer, type: 'timestamp', nullable: true })
  finishAt?: Moment;

  /**
   * Ценность задачи в условных единицах
   */
  @ApiProperty()
  @Column({ nullable: true })
  value: number;

  /**
   * Может быть ссылкой на внешний сервис/ресурс
   */
  @ApiProperty()
  @Column({ nullable: true })
  source: string;

  @ApiProperty()
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, user => user.works, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ApiProperty()
  @Column({ nullable: false })
  taskId: number;

  @ApiProperty({ type: () => Task })
  @ManyToOne(() => Task, task => task.userWorks, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  task: Task;

  @ApiProperty()
  @Column({ nullable: true })
  taskTypeId: number;

  @ApiProperty({ type: TaskType })
  @ManyToOne(() => TaskType, { eager: true, nullable: true })
  taskType: TaskType;

  @ApiProperty({ type: Number })
  get projectId() {
    return this.task ? this.task.projectId : null;
  }
}
