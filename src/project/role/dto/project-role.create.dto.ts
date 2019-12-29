import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WorkFlow {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsNumber()
  test: number;
}

export class ProjectRoleCreateDto {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiModelProperty({ type: WorkFlow })
  @IsNotEmpty()
  workFlow: WorkFlow;
}
