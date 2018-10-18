import moment = require('moment');
import { ColumnOptions } from 'typeorm';

export const momentDateTransformer = {
  transformer: {
    from: d => moment(d),
    to: (d: moment.Moment) => (d ? d.toDate() : undefined),
  },
} as ColumnOptions;
