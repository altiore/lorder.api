import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { get } from 'lodash';

import { Project } from '../project/project.entity';

@Entity()
export class ProjectPub {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @ApiProperty()
  @Column({ nullable: false })
  projectId: number;

  @ApiProperty({ type: () => Project })
  @OneToOne(() => Project, project => project.pub, { nullable: false })
  @JoinColumn()
  project: Project;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  domain: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  title: string;

  @ApiProperty()
  @Column({ default: true })
  isOpen: boolean;

  get members() {
    return get(this.project, ['members']);
  }

  @ApiPropertyOptional()
  @Column({ type: 'json', default: {} })
  statistic: object;
}
