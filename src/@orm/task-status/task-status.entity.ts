import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TaskStatusMove } from '../task-status-move/task-status-move.entity';

@Entity()
export class TaskStatus {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ unique: true })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusFrom!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusTo!: number;

  @OneToMany(() => TaskStatusMove, m => m.from)
  fromMoves: TaskStatusMove[];

  @OneToMany(() => TaskStatusMove, m => m.to)
  toMoves: TaskStatusMove[];
}
