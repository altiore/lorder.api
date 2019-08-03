import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

export enum CLOUD_TYPE {
  GOOGLE = 'google',
}

@Entity()
export class Media {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true, nullable: false })
  url: string;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  title?: string;

  @ApiModelProperty()
  @Column('text')
  type: MEDIA_TYPE;

  @ApiModelPropertyOptional()
  @Column('text', { nullable: true })
  cloud?: CLOUD_TYPE;
}
