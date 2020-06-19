import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskStatus {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @PrimaryColumn()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusFrom!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusTo!: number;
}
