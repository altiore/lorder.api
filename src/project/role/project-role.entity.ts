import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Project } from '../../@orm/project/project.entity';
import { RoleFlow } from '../../@orm/role-flow';

import { ProjectRoleAllowedMove } from './project-role-allowed-move/project-role-allowed-move.entity';

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

  @ApiProperty({ type: RoleFlow })
  @ManyToOne(type => RoleFlow, { nullable: false })
  role!: RoleFlow;

  @ApiProperty()
  @Column()
  projectId!: number;

  @Exclude()
  @ManyToOne(type => Project, project => project.roles, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project!: Project;

  @ApiProperty({ isArray: true, type: ProjectRoleAllowedMove })
  @OneToMany(() => ProjectRoleAllowedMove, m => m.projectRole)
  allowedMoves: ProjectRoleAllowedMove[];
}
