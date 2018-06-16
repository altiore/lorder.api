import { ApiModelProperty } from '@nestjs/swagger';

export class MailAcceptedDto {
  @ApiModelProperty() public readonly statusCode: number;

  @ApiModelProperty() public readonly statusMessage: string;
}
