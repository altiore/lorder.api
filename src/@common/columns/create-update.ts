import { UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';

export abstract class CreateUpdate {
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