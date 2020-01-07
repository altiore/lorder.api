import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsNumber } from 'class-validator';

export class TaskTypesDto {
  @ApiProperty({ isArray: true, type: Number })
  @IsNotEmpty({ message: 'Добавьте хотя бы один тип задачи' })
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  taskTypes: number[];
}
