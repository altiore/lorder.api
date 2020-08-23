import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { STATUS_NAME } from '../../@domains/strategy';

@Entity()
export class TaskStatus {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @PrimaryColumn()
  name!: STATUS_NAME;

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
