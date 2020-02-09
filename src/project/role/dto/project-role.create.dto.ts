import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class WorkFlow {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  test: number;
}

export class ProjectRoleCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Matches(/^[a-z][a-z0-9\-_]{3,19}$/)
  @Length(3, 20)
  roleId: string;
}
