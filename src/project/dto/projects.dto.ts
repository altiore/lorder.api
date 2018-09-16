import { ApiModelPropertyOptional } from '@nestjs/swagger';
import {IsNumber, IsNumberString, IsOptional, IsString} from 'class-validator';

export class ProjectsDto {
    @ApiModelPropertyOptional()
    @IsNumberString()
    @IsOptional()
    public readonly countProjects?: number;

    @ApiModelPropertyOptional()
    @IsNumberString()
    @IsOptional()
    public readonly fromNumber?: number;

    @ApiModelPropertyOptional()
    @IsString()
    @IsOptional()
    public readonly orderBy?: string;

    @ApiModelPropertyOptional()
    @IsString()
    @IsOptional()
    public readonly order?: string;
}
