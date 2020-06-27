import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';

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
}
