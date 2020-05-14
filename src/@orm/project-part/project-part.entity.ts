import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';

@Entity()
export class ProjectPart {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  title!: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, m => m.parts, { nullable: false })
  @JoinColumn()
  project!: Project;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  parentId?: number;

  @ApiPropertyOptional({ type: ProjectPart })
  @ManyToOne(t => ProjectPart, m => m.children, { nullable: true })
  parent?: ProjectPart;

  @ApiProperty({ type: ProjectPart, isArray: true })
  @OneToMany(t => ProjectPart, m => m.parent)
  children: ProjectPart[];
}
