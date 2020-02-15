import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

import { ProjectRoleAllowedMove } from '../project-role-allowed-move/project-role-allowed-move.entity';
import { Project } from '../project/project.entity';
import { RoleFlow } from '../role-flow';

// const WORK_FLOW_EXAMPLE = {
//   todo: {
//     stages: [[1000, 2000]],
//     forward: {
//       1000: 2001,
//     },
//     back: {
//       1000: 998,
//     },
//   },
//   inProgress: {},
//   inCheck: {},
//   done: {},
// };

@Entity()
export class ProjectRole {
  @ApiProperty({ type: String })
  @ManyToOne(type => RoleFlow, { eager: true, primary: true })
  role: RoleFlow | string;

  @ApiProperty({ type: Number })
  @ManyToOne(type => Project, project => project.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project | number;

  @OneToMany(() => ProjectRoleAllowedMove, m => m.projectRole)
  allowedMoves: ProjectRoleAllowedMove[];
}
