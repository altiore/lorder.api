import { COLUMN_TYPE, ROLE, TASK_TYPE } from '../types';
import { getColumns, getSteps } from './steps';

describe('strategy advanced', () => {
  it('getSteps', () => {
    expect(getSteps(TASK_TYPE.FEAT).length).toBe(14);
  });

  it('getRoleSteps ARCHITECT + DEVELOPER', () => {
    expect(getColumns([ROLE.ARCHITECT, ROLE.DEVELOPER]).length).toEqual(14);
  });

  it('getRoleSteps ARCHITECT', () => {
    expect(getColumns(ROLE.ARCHITECT).length).toEqual(6);
  });

  it('getRoleSteps DEVELOPER', () => {
    expect(getColumns(ROLE.DEVELOPER).length).toEqual(6);
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
