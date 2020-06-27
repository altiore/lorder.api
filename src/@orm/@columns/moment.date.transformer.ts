import moment = require('moment');
import { ColumnOptions } from 'typeorm';

export const momentDateTransformer = {
  transformer: {
    from: (d) => (d ? moment(d) : undefined),
    // d can be also FindOperator here,
    // that's why we should check that d.toDate function exists here
    to: (d: moment.Moment) => (d ? (d.toDate ? d.toDate() : d) : undefined),
  },
} as ColumnOptions;
