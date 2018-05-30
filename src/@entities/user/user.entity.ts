import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Moment } from 'moment';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Role } from '../role';

@Entity()
export class User {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ unique: true })
  identifier: string;

  @ApiModelProperty()
  @Column({ unique: true, nullable: true, length: 254, transformer: {
    to: d => d ? d.toLowerCase() : undefined,
    from: d => d,
  }})
  email: string;

  @ApiModelProperty()
  @Column({ unique: true, nullable: true, length: 13, transformer: {
    to: d => d ? d.replace(/[\D]/gi, '') : undefined,
    from: d => d,
  }})
  tel: string;

  @ApiModelProperty()
  @Column('int')
  status: number;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ManyToMany(type => Role, undefined, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
