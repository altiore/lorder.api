import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Project } from '../project/project.entity';

@Entity()
export class ProjectPub {
  @ApiModelProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @ApiModelProperty({ type: Project })
  @OneToOne(() => Project, project => project.pub, { nullable: false })
  @JoinColumn()
  project: Project;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  domain: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  title: string;

  @ApiModelProperty()
  @Column({ default: true })
  isOpen: boolean;
}
