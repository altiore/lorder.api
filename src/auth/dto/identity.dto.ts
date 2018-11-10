import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ROLES } from '../../@orm/role';

export class IdentityDto {
  @ApiModelPropertyOptional()
  public readonly avatar?: string;

  @ApiModelProperty()
  public readonly bearerKey: string;

  @ApiModelProperty()
  public readonly defaultProjectId: number;

  @ApiModelProperty()
  public readonly role: ROLES;

  @ApiModelProperty()
  public readonly email: string;
}
