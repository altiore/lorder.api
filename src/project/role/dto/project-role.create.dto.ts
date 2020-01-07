import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WorkFlow {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  test: number;
}

export class ProjectRoleCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ type: WorkFlow })
  @IsNotEmpty()
  workFlow: WorkFlow;
}
