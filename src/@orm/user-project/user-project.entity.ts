import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { ProjectRole } from '../project-role/project-role.entity';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

import { ACCESS_LEVEL } from './user-project.consts';

@Entity()
export class UserProject {
  static simpleFields = ['accessLevel', 'timeSum', 'valueSum', 'roles'];

  @Column({ primary: true })
  memberId: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(t => User, m => m.memberProjects, { eager: true, primary: true })
  member: User;

  @Column({ primary: true })
  projectId: number;

  @ManyToOne(t => Project, m => m.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @ApiProperty()
  @Column('integer')
  accessLevel: ACCESS_LEVEL;

  @Column('float8', { default: 0 })
  timeSum: number;

  @Column('float8', { default: 0 })
  valueSum: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(t => User, m => m.invitedMembers, { nullable: true })
  inviter?: User;

  @ManyToMany(t => ProjectRole)
  @JoinTable()
  roles: ProjectRole[];
}
