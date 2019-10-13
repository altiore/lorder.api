import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { Specialty } from '../specialty';
import { User } from '../user/user.entity';
import { ACCESS_LEVEL } from './user-project.consts';

@Entity()
export class UserProject {
  @ApiModelProperty()
  @Column('integer')
  accessLevel: ACCESS_LEVEL;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.invitedMembers, { nullable: false })
  inviter: User;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.memberProjects, { primary: true, eager: true })
  member: User;

  @ManyToOne(type => Project, project => project.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;
}
