import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { Role } from '../role/role.entity';

@Entity()
export class ProjectRole {
  @ApiProperty({ type: Role })
  @ManyToOne(type => Role, { eager: true, primary: true })
  role: Role;

  @ApiProperty({ type: () => Project })
  @ManyToOne(type => Project, project => project.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @ApiProperty()
  @Column('simple-json', { nullable: false })
  workFlow: object;
}
