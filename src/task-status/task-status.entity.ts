import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TaskStatusMove } from '../@orm/task-status-move/task-status-move.entity';

@Entity()
export class TaskStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => TaskStatusMove, m => m.from)
  fromMoves: TaskStatusMove[];

  @OneToMany(() => TaskStatusMove, m => m.to)
  toMoves: TaskStatusMove[];
}
