import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import * as moment from 'moment';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';

import { ProjectRoleAllowedMove } from '../project-role-allowed-move/project-role-allowed-move.entity';
import { TaskStatus } from '../task-status/task-status.entity';

@Entity()
export class TaskStatusMove {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @Column({ nullable: true })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @ApiProperty()
  @Column()
  fromId!: number;

  @ManyToOne(() => TaskStatus, m => m.fromMoves, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  from!: TaskStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @ApiProperty()
  @Column()
  toId!: number;

  @ManyToOne(() => TaskStatus, m => m.toMoves, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  to!: TaskStatus;

  @Transform((value: moment.Moment) => moment(value).toISOString())
  @CreateDateColumn(momentDateTransformer)
  createdAt!: moment.Moment;

  @OneToMany(() => ProjectRoleAllowedMove, m => m.taskStatusMove)
  allowedMoves: ProjectRoleAllowedMove[];
}
