import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

export enum URGENCY {
  LOW = 'LOW',
  REGULAR = 'REGULAR',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  ULTRA = 'ULTRA',
}

const MAP_URGENCY = {
  [URGENCY.LOW]: 0.618,
  [URGENCY.REGULAR]: 1,
  [URGENCY.HIGH]: 1.618,
  [URGENCY.CRITICAL]: 2.618,
  [URGENCY.ULTRA]: 4.236,
};

export enum COMPLEXITY {
  JUNIOR = 'JUNIOR',
  MIDDLE = 'MIDDLE',
  SENIOR = 'SENIOR',
  ARCHITECT = 'ARCHITECT',
  DISCUSSION = 'DISCUSSION',
  COMMUNITY = 'COMMUNITY',
}

export const MAP_COMPLEXITY = {
  [COMPLEXITY.JUNIOR]: 0.368,
  [COMPLEXITY.MIDDLE]: 1,
  [COMPLEXITY.MIDDLE]: 2.718,
  [COMPLEXITY.ARCHITECT]: 7.389,
  [COMPLEXITY.DISCUSSION]: 20.085,
  [COMPLEXITY.COMMUNITY]: 54.598,
};

@Entity('user_tasks')
export class UserTask {
  static plainFields = ['complexity', 'urgency', 'userValue'];

  @Index()
  @Column({ primary: true })
  userId: number;

  @ManyToOne((t) => User, { eager: true, primary: true })
  user: User;

  @Index()
  @Column({ primary: true })
  taskId: number;

  @ManyToOne((t) => Task, (m) => m.userTasks, {
    onDelete: 'CASCADE',
    primary: true,
  })
  task: Task;

  @Column('float', { default: 0 })
  benefitPart: number;

  @Column('float', { default: 0 })
  time: number;

  @Column('enum', { nullable: true, enum: COMPLEXITY })
  complexity: COMPLEXITY;

  @Column('enum', { nullable: true, enum: URGENCY })
  urgency: URGENCY;

  @Column('float', { nullable: true })
  userValue: number;
}
