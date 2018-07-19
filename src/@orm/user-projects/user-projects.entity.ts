import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';


@Entity()
export class UserProjects {

  @ManyToOne(type => User, user => user.id, { primary: true })
  memberId: User;

  @ManyToOne(type => Project, project => project.id, { primary: true })
  projectId: Project;

  @Column()
  status: number;

  @Column()
  accessLevel: number;

}