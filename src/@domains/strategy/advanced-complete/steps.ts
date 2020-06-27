import { intersection } from 'lodash';

import { IColumn, IStep, ROLE, TASK_TYPE } from '..';
import { feature_strategy } from './strategies/feature-strategy';

export const stepsObj: { [key in TASK_TYPE]: IStep[] } = {
  [TASK_TYPE.FEAT]: feature_strategy,
  [TASK_TYPE.BUG]: [],
  [TASK_TYPE.ORG]: [],
  [TASK_TYPE.DOC]: [],
};

export function getSteps(taskType: TASK_TYPE) {
  return stepsObj[taskType];
}

export function getColumns(roles: ROLE | ROLE[]): IColumn[] {
  const rolesArr = Array.isArray(roles) ? roles : [roles];

  if (rolesArr.length === 1) {
    const role = rolesArr[0];
    return getSteps(TASK_TYPE.FEAT).reduce((res, cur) => {
      // Если роли нет в списке ролей, которым доступен статус, то пропустить этот шаг
      if (cur.roles.indexOf(role) === -1) {
        return res;
      }

      const columnName = cur.column?.[rolesArr[0]] || cur.status;
      const columnIndex = res.findIndex((el) => el.column === columnName);
      if (columnIndex === -1) {
        res.push({
          column: columnName,
          statuses: [cur.status],
          moves: cur.moves,
        });
      } else {
        res[columnIndex].statuses.push(cur.status);
        res[columnIndex].moves.concat(cur.moves);
      }
      return res;
    }, []);
  } else {
    return getSteps(TASK_TYPE.FEAT)
      .filter((step: IStep) => {
        return Boolean(intersection(step.roles, rolesArr).length);
      })
      .map((el) => ({
        column: el.status,
        statuses: [el.status],
        moves: el.moves,
      }));
  }
}
