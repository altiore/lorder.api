import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectRole } from '../project-role/project-role.entity';
import { TaskStatus } from '../task-status/task-status.entity';

export enum TASK_STATUS_MOVE_TYPE {
  PREPARE = 'prepare',
  ASK_IMPROVE = 'ask_improve',

  START = 'start',
  ASK_PREPARE = 'ask_prepare',

  COMPLETE = 'complete',
  ASK_RESTART = 'ask_restart',

  ESTIMATE = 'estimate',
  ASK_RECHECK = 'ask_recheck',
}

export interface ITaskMove {
  id: number;
  title: string;
  type: TASK_STATUS_MOVE_TYPE;

  projectRoleId: number;
  fromId: number;
  toId: number;
}

@Entity()
export class ProjectRoleAllowedMove {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @ApiProperty()
  @Column()
  public projectRoleId!: number;

  @ManyToOne(type => ProjectRole, m => m.allowedMoves, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public projectRole!: ProjectRole;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(TASK_STATUS_MOVE_TYPE))
  @ApiProperty({ enum: TASK_STATUS_MOVE_TYPE })
  @Column('enum', { enum: TASK_STATUS_MOVE_TYPE })
  public type!: TASK_STATUS_MOVE_TYPE;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ nullable: false })
  fromName!: string;

  @ManyToOne(t => TaskStatus, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  from!: TaskStatus;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ nullable: false })
  toName!: string;

  @ManyToOne(t => TaskStatus, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  to!: TaskStatus;
}
