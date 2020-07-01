import { COLUMN_TYPE } from './column-type';
import { STATUS_NAME } from './status';

describe('column-type', () => {
  it('COLUMN_TYPE не должен совпадать ни с одним значением STATUS_NAME', () => {
    Object.values(COLUMN_TYPE).forEach((columnType) => {
      if (Object.values(STATUS_NAME).includes(columnType as any)) {
        throw new Error(`columnType "${columnType}" уже используется в STATUS_NAME`);
      }
    });
  });
});
