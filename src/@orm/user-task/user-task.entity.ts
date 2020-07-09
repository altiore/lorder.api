import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

enum URGENCY {
  LOW = 0.618,
  REGULAR = 1,
  HIGH = 1.618,
  CRITICAL = 2.618,
  ULTRA = 4.236,
}

enum COMPLEXITY {
  EASY = 0.368,
  REGULAR = 1,
  HIGH = 2.718,
  STRONG = 7.389,
  ULTRA_STRONG = 20.085,
  UNKNOWN = 54.598,
}

@Entity('user_tasks')
export class UserTask {
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
  value: number;
}
