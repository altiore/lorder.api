import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity()
export class Media {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true, nullable: false })
  url: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  title?: string;

  @ApiModelProperty()
  @Column('text')
  type: MEDIA_TYPE;
}
