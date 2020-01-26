import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

import { ACCESS_LEVEL } from './user-project.consts';

@Entity()
export class UserProject {
  static simpleFields = ['accessLevel', 'timeSum', 'valueSum'];

  @ApiProperty()
  @Column('integer')
  accessLevel: ACCESS_LEVEL;

  @ApiProperty({ type: () => User })
  @ManyToOne(type => User, user => user.invitedMembers, { nullable: false })
  inviter: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(type => User, user => user.memberProjects, { eager: true, primary: true })
  member: User;

  @ManyToOne(type => Project, project => project.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @Column('float8', { default: 0 })
  timeSum: number;

  @Column('float8', { default: 0 })
  valueSum: number;
}
