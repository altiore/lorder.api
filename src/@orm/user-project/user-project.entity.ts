import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { ACCESS_LEVEL } from './user-project.consts';

@Entity()
export class UserProject {
  static INVITED_STATUS = 0;
  static ACCEPT_INVITATION_STATUS = 1;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.memberProjects, { primary: true, eager: true })
  member: User;

  @ManyToOne(type => Project, project => project.members, { primary: true })
  project: Project;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.invitedMembers, { nullable: false })
  inviter: User;

  @ApiModelProperty()
  @Column()
  status: number;

  @ApiModelProperty()
  @Column('integer')
  accessLevel: ACCESS_LEVEL;
}
