import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

import { Project } from '../project/project.entity';
import { ProjectTaskType } from '../project-task-type/project-task-type.entity';

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

  @ApiModelProperty({ type: Project, isArray: true })
  @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.taskType)
  projectTaskTypes: ProjectTaskType[];
}
