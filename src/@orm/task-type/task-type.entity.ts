import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {Project} from '../project';
import {ProjectTaskType} from '../project-task-type/project-task-type.entity';

@Entity()
export class TaskType {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ nullable: false })
  title: string;

    @ApiModelProperty({ type: Project, isArray: true })
    @OneToMany(type => ProjectTaskType, projectTaskType => projectTaskType.project)
    projectTaskTypes: ProjectTaskType[];
}
