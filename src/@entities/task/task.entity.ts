import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

import { Project } from '../project/project.entity';

@Entity()
@Tree('closure-table')
export class Task {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: Project })
  @ManyToOne(() => Project, project => project.tasks, { nullable: false })
  project: Project;

  // ApiModel does not work here due to circular dependency
  @TreeParent() parent?: Task;

  // ApiModel does not work here due to circular dependency
  @TreeChildren() children?: Task[];

  @ApiModelProperty()
  @Column({ nullable: false })
  title: string;

  @ApiModelProperty()
  @Column('text')
  description: string;

  @ApiModelPropertyOptional()
  @Column()
  value: number;
}
