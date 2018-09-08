import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { Project } from '../project/project.entity';

@Entity()
export class TaskType {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ nullable: false })
  title: string;

  @ApiModelProperty()
  @Column({ default: false, nullable: false })
  isPublic: boolean;

  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.taskType)
  projectTaskTypes: ProjectTaskType[];
}
