import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { Role } from '../role/role.entity';

@Entity()
export class ProjectRole {
  @ApiModelProperty({ type: Role })
  @ManyToOne(type => Role, { eager: true, primary: true })
  role: Role;

  @ApiModelProperty({ type: Project })
  @ManyToOne(type => Project, project => project.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @ApiModelProperty()
  @Column('simple-json', { nullable: false })
  workFlow: object;
}
