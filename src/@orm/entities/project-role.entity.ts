import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ROLE } from '../../@domains/strategy';
import { ProjectRoleAllowedMove } from './project-role-allowed-move.entity';
import { Project } from './project.entity';
import { RoleFlow } from './role-flow.entity';

@Unique(['role', 'projectId'])
@Entity()
export class ProjectRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  @Column({ nullable: true })
  name: string;

  @Column()
  roleId: ROLE;

  @ApiProperty()
  @Column('bool', { nullable: false, default: false })
  isPublic!: boolean;

  @ApiProperty({ type: RoleFlow })
  @ManyToOne((type) => RoleFlow, { nullable: false, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
  role!: RoleFlow;

  @ApiProperty()
  @Column()
  projectId!: number;

  @Exclude()
  @ManyToOne((type) => Project, (project) => project.roles, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project!: Project;

  // TODO: либо перенести в эту таблицу данные стратегий. Либо удалить эту связанную таблицу
  @ApiProperty({ isArray: true, type: ProjectRoleAllowedMove })
  @OneToMany(() => ProjectRoleAllowedMove, (m) => m.projectRole)
  allowedMoves: ProjectRoleAllowedMove[];
}
