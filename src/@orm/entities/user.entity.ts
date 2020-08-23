import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { includes } from 'lodash';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Media } from './media.entity';
import { Project } from './project.entity';
import { Role, ROLES } from './role.entity';
import { UserProject } from './user-project.entity';
import { UserRole } from './user-role.entity';
import { UserWork } from './user-work.entity';

@Entity()
export class User {
  static JUST_CREATED = 1;
  static ACTIVATED = 10;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    length: 254,
    nullable: true,
    transformer: {
      from: (d) => d,
      to: (d) => (d ? d.toLowerCase() : undefined),
    },
    // select: false,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    length: 13,
    nullable: true,
    transformer: {
      from: (d) => d,
      to: (d) => (d ? d.replace(/[\D]/gi, '') : undefined),
    },
    select: false,
    unique: true,
  })
  tel: string;

  @ApiProperty()
  @Column('int')
  status: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ type: Media })
  @OneToOne(() => Media, { eager: true, nullable: true })
  @JoinColumn()
  avatar?: Media;

  @ManyToOne((t) => Project, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  defaultProject: Project;

  @Column({ nullable: true })
  defaultProjectId: number;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiProperty({ type: UserRole, isArray: true })
  @OneToMany(() => UserRole, (m) => m.user, { eager: true, cascade: ['insert', 'update', 'remove'] })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userRoles: UserRole[];

  get roles(): Role[] {
    return this.userRoles ? this.userRoles.map((el) => el.role) : [];
  }

  @ApiPropertyOptional()
  @Column({ nullable: true })
  displayName: string;

  @OneToMany((type) => Project, (project) => project.owner)
  ownProjects: Project[];

  @OneToMany((type) => UserProject, (userProject) => userProject.member)
  memberProjects: UserProject[];

  @OneToMany((type) => UserProject, (userProject) => userProject.member)
  invitedMembers: UserProject[];

  @OneToMany((type) => UserWork, (userWork) => userWork.user)
  works: UserWork[];

  get role(): ROLES {
    const stringRoles = this.roles.map((uRole) => uRole.name);
    if (includes(stringRoles, ROLES.SUPER_ADMIN)) {
      return ROLES.SUPER_ADMIN;
    }
    if (includes(stringRoles, ROLES.ADMIN)) {
      return ROLES.ADMIN;
    }

    return ROLES.USER;
  }

  get isSuperAdmin() {
    return this.role === ROLES.SUPER_ADMIN;
  }

  get avatarUrl() {
    return this.avatar ? this.avatar.url : null;
  }

  get profileData(): {
    avatar?: string;
    defaultProjectId: number;
    displayName: string;
    email: string;
    id: number;
    role: ROLES;
    tel: string;
  } {
    return {
      avatar: this.avatarUrl,
      defaultProjectId: this.defaultProjectId,
      displayName: this.displayName,
      email: this.email,
      id: this.id,
      role: this.role,
      tel: this.tel || '',
    };
  }
}
