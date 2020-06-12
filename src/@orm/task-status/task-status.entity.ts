import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskStatus {
  @ApiProperty()
  @PrimaryColumn()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column({ unique: true })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusFrom!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column({ unique: true })
  statusTo!: number;
}
