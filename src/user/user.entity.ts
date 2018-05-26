import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as moment from 'moment';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  identifier: string;

  @ApiModelProperty()
  @Column('int')
  status: number;

  @ApiModelProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn({
    transformer: {
      to: d => d ? d.toDate() : undefined,
      from: d => moment(d),
    },
  })
  createdAt: moment.Moment;

  @ApiModelProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn({
    transformer: {
      to: d => d ? d.toDate() : undefined,
      from: d => moment(d),
    },
  })
  updatedAt: moment.Moment;
}
