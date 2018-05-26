import { Entity, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class UserRole {
  @ApiModelProperty()
  @PrimaryColumn()
  userId: number;

  @ApiModelProperty()
  @PrimaryColumn()
  roleId: number;
}
