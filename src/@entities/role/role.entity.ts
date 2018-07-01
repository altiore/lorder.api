import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @ApiModelProperty()
  @PrimaryColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  name: string;
}
