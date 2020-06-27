import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MOVE_TYPE } from '../../@domains/strategy';
import { ProjectRole } from '../project-role/project-role.entity';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { TaskStatus } from '../task-status/task-status.entity';

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

  @ManyToOne((type) => ProjectRole, (m) => m.allowedMoves, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public projectRole!: ProjectRole;

  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(MOVE_TYPE))
  @ApiProperty({ enum: MOVE_TYPE })
  @Column('enum', { enum: MOVE_TYPE })
  public type!: MOVE_TYPE;

  @Column()
  public taskTypeProjectId: number;

  @Column()
  public taskTypeTaskTypeId: number;

  @ManyToOne((t) => ProjectTaskType, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  public taskType: ProjectTaskType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ nullable: false })
  fromName!: string;

  @ManyToOne((t) => TaskStatus, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  from!: TaskStatus;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ nullable: false })
  toName!: string;

  @ManyToOne((t) => TaskStatus, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  to!: TaskStatus;

  get title() {
    return this.type + '_to_' + this.toName;
  }
}
