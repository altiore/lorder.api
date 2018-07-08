import { ColumnOptions } from 'typeorm';
import * as moment from 'moment';

export const momentDateTransformer = {
  transformer: {
    to: d => (d ? d.toDate() : undefined),
    from: d => ('default' in moment ? moment['default'](d) : moment(d)),
  },
} as ColumnOptions;
