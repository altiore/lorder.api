import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Entity()
export class UserProject {
  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.memberProjects, { primary: true, eager: true })
  member: User;

  @ApiModelProperty({ type: Project })
  @ManyToOne(type => Project, project => project.projectMembers, { primary: true })
  project: Project;

  @ApiModelProperty({ type: User })
  @ManyToOne(type => User, user => user.invitedMembers, { nullable: false })
  inviter: User;

  @ApiModelProperty()
  @Column()
  status: number;

  @ApiModelProperty()
  @Column()
  accessLevel: number;
}
