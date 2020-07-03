import { ROLE, TASK_TYPE } from '..';
import { COLUMN_TYPE } from '../types/column-type';
import { getColumns, getSteps } from './steps';

describe('strategy advanced', () => {
  it('getSteps', () => {
    expect(getSteps(TASK_TYPE.FEAT).length).toBe(15);
  });

  it('getRoleSteps ARCHITECT + DEVELOPER', () => {
    expect(getColumns([ROLE.ARCHITECT, ROLE.DEVELOPER]).length).toEqual(15);
  });

  it('getRoleSteps ARCHITECT', () => {
    expect(getColumns(ROLE.ARCHITECT).length).toEqual(10);
  });

  it('getRoleSteps DEVELOPER', () => {
    expect(getColumns(ROLE.DEVELOPER).length).toEqual(8);
  });

  it('getRoleSteps TESTER', () => {
    const testerColumns = getColumns(ROLE.TESTER);

    expect(testerColumns.length).toEqual(4);
    expect(testerColumns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          column: COLUMN_TYPE.TO_DO,
        }),
        expect.objectContaining({
          column: COLUMN_TYPE.REVIEWING,
        }),
        expect.objectContaining({
          column: COLUMN_TYPE.FINISHING,
        }),
      ])
    );
  });
});
