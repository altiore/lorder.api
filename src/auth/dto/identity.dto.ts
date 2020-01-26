import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ROLES } from '@orm/role';

export class IdentityDto {
  @ApiPropertyOptional()
  public readonly avatar?: string;

  @ApiProperty()
  public readonly bearerKey: string;

  @ApiProperty()
  public readonly defaultProjectId: number;

  @ApiProperty()
  public readonly role: ROLES;

  @ApiProperty()
  public readonly email: string;
}
