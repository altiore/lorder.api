import { ApiModelProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiModelProperty()
  public readonly bearerKey: string;
}
