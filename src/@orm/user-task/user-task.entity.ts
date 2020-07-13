import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

export enum URGENCY_NAME {
  LOW = 'LOW',
  REGULAR = 'REGULAR',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  ULTRA = 'ULTRA',
}

enum URGENCY {
  LOW = 0.618,
  REGULAR = 1,
  HIGH = 1.618,
  CRITICAL = 2.618,
  ULTRA = 4.236,
}

export enum COMPLEXITY_NAME {
  JUNIOR = 'JUNIOR',
  MIDDLE = 'MIDDLE',
  SENIOR = 'SENIOR',
  ARCHITECT = 'ARCHITECT',
  DISCUSSION = 'DISCUSSION',
  COMMUNITY = 'COMMUNITY',
}

enum COMPLEXITY {
  JUNIOR = 0.368,
  MIDDLE = 1,
  SENIOR = 2.718,
  ARCHITECT = 7.389,
  DISCUSSION = 20.085,
  COMMUNITY = 54.598,
}

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
