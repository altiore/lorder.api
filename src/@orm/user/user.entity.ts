import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Media } from '../media/media.entity';
import { Project } from '../project/project.entity';
import { Role, ROLES } from '../role/role.entity';
import { Task } from '../task/task.entity';
import { UserProject } from '../user-project/user-project.entity';
import { UserWork } from '../user-work/user-work.entity';

@Entity()
export class User {
  static JUST_CREATED = 1;
  static ACTIVATED = 10;

  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({
    length: 254,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.toLowerCase() : undefined),
    },
    unique: true,
  })
  email: string;

  @ApiModelProperty()
  @Column({
    length: 13,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.replace(/[\D]/gi, '') : undefined),
    },
    unique: true,
  })
  tel: string;

  @ApiModelProperty()
  @Column('int')
  status: number;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @Column({ nullable: true, select: false })
  password: string;

  @ApiModelProperty({ type: Media })
  @OneToOne(() => Media, { eager: true, nullable: true })
  @JoinColumn()
  avatar?: Media;

  @Column({ nullable: true })
  defaultProjectId: number;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiModelProperty({ type: Role, isArray: true })
  @ManyToMany(() => Role, undefined, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @OneToMany(type => Project, project => project.owner)
  ownProjects: Project[];

  @OneToMany(type => UserProject, userProject => userProject.member)
  memberProjects: UserProject[];

  @OneToMany(type => UserProject, userProject => userProject.member)
  invitedMembers: UserProject[];

  @ManyToMany(type => Task, task => task.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'user_tasks' })
  tasks: Task[];

  @OneToMany(type => UserWork, userWork => userWork.user)
  works: UserWork[];

  get role() {
    return { 1: ROLES.USER, 2: ROLES.ADMIN, 3: ROLES.SUPER_ADMIN }[this.roles.length];
  }

  get isSuperAdmin() {
    return this.role === ROLES.SUPER_ADMIN;
  }

  get avatarUrl() {
    return this.avatar ? this.avatar.url : null;
  }

  get publicData(): { avatar?: string; defaultProjectId: number; email: string; role: ROLES } {
    return {
      avatar: this.avatarUrl,
      defaultProjectId: this.defaultProjectId,
      email: this.email,
      role: this.role,
    };
  }
}
