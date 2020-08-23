import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;
}
