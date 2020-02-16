import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { TaskStatusMove } from '../@orm/task-status-move/task-status-move.entity';

@Entity()
export class TaskStatus {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @ApiProperty()
  @PrimaryColumn()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => TaskStatusMove, m => m.from)
  fromMoves: TaskStatusMove[];

  @OneToMany(() => TaskStatusMove, m => m.to)
  toMoves: TaskStatusMove[];
}
