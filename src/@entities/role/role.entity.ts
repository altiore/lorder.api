import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

import { User } from '../user'

@Entity()
export class Role {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  name: string;

  @ManyToMany(type => User, user => user.roles)
  users: User[];
}
