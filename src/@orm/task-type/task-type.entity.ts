import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectTaskType } from '../project-task-type/project-task-type.entity';

@Entity()
export class TaskType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  name: string;

  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.taskType)
  projectTaskTypes: ProjectTaskType[];
}
