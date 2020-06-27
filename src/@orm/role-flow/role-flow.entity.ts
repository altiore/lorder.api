import { ApiProperty } from '@nestjs/swagger';

import { IsLowercase, IsString, Length, Matches } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { ROLE } from '../../@domains/strategy';

@Entity()
export class RoleFlow {
  @ApiProperty()
  @IsString()
  @IsLowercase()
  @Matches(/^[a-z][a-z0-9\-_]{3,19}$/)
  @Length(3, 20)
  @PrimaryColumn()
  id: ROLE;

  @ApiProperty()
  @IsString()
  @Length(3, 120)
  @Column()
  name: string;
}
