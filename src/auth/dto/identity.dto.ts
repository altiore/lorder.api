import { ApiModelProperty } from '@nestjs/swagger';
import { ROLES } from '../../@orm/role';

export class IdentityDto {
  @ApiModelProperty()
  public readonly bearerKey: string;

  @ApiModelProperty()
  public readonly role: ROLES;
}
