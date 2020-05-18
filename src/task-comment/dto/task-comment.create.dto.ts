import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TaskCommentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  text!: string;
}
