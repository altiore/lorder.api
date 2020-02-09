import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IsLowercase, IsString, Length, Matches } from 'class-validator';

@Entity()
export class RoleFlow {
  @ApiProperty()
  @IsString()
  @IsLowercase()
  @Matches(/^[a-z][a-z0-9\-_]{3,19}$/)
  @Length(3, 20)
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @IsString()
  @Length(3, 120)
  @Column()
  name: string;
}
