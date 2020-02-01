import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectTaskType } from '../project-task-type/project-task-type.entity';

@Entity()
export class TaskType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  title: string;

  @ApiProperty()
  @Column({ nullable: true })
  icon: string | null;

  @ApiProperty()
  @Column({ default: '#D5D5D5', nullable: true })
  color: string | null;

  @ApiProperty()
  @Column({ default: false, nullable: false })
  isPublic: boolean;

  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.taskType)
  projectTaskTypes: ProjectTaskType[];
}
