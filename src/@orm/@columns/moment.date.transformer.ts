import * as moment from 'moment';
import { ColumnOptions } from 'typeorm';

export const momentDateTransformer = {
  transformer: {
    from: d => moment(d),
    to: d => (d ? d.toDate() : undefined),
  },
} as ColumnOptions;
