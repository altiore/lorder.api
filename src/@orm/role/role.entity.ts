import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum ROLES {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
  USER = 'user',
}

@Entity()
export class Role {
  @ApiModelProperty()
  @PrimaryColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  name: string;
}
