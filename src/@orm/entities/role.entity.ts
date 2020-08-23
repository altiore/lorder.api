import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum ROLES {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
  USER = 'user',
}

@Entity()
export class Role {
  @ApiProperty()
  @PrimaryColumn()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @Length(3, 120)
  @Column({ unique: true })
  name: string;
}
