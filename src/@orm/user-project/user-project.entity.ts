import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

export enum ACCESS_LEVEL {
  RED = 1,
  ORANGE = 2,
  YELLOW = 3,
  GREEN = 4,
  BLUE = 5,
  INDIGO = 6,
  VIOLET = 7,
}

@Entity()
export class UserProject {
  @ManyToOne(type => User, user => user.memberProjects, { primary: true, eager: true })
  member: User;

  @ManyToOne(type => Project, project => project.members, { primary: true })
  project: Project;

  @ManyToOne(type => User, user => user.invitedMembers, { nullable: false })
  inviter: User;

  @ApiModelProperty()
  @Column()
  status: number;

  @ApiModelProperty()
  @Column()
  accessLevel: ACCESS_LEVEL;
}
