import { ApiProperty } from '@nestjs/swagger';

export class MailAcceptedDto {
  @ApiProperty()
  public readonly statusCode: number;

  @ApiProperty()
  public readonly statusMessage: string;
}
