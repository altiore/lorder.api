import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IsNumber, IsString, Length } from 'class-validator';

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
