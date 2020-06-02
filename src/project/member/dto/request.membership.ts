import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestMembership {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly role: string;
}
