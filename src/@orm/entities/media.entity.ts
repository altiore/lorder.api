import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  PROJECT_LOGO = 'project-logo',
}

export enum CLOUD_TYPE {
  GOOGLE = 'google',
}

@Entity()
export class Media {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  url: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  title?: string;

  @ApiProperty()
  @Column('text')
  type: MEDIA_TYPE;

  @ApiPropertyOptional()
  @Column('text', { nullable: true })
  cloud?: CLOUD_TYPE;
}
