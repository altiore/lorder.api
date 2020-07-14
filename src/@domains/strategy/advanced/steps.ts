import { intersection } from 'lodash';

import { IColumn, IMove, IShortMove, IStep, ROLE, TASK_TYPE } from '../types';
import { feature_strategy } from './strategies/feature-strategy';

export const stepsObj: { [key in TASK_TYPE]: IStep[] } = {
  [TASK_TYPE.FEAT]: feature_strategy,
  [TASK_TYPE.BUG]: [],
  [TASK_TYPE.ORG]: [],
  [TASK_TYPE.DOC]: [],
};

export function getSteps(taskType: TASK_TYPE): IStep[] {
  return stepsObj[taskType];
}

export function getColumns(roles: ROLE | ROLE[]): IColumn[] {
  const rolesArr = Array.isArray(roles) ? roles : [roles];

  const reduceMoves = (moves: IMove[], step: IStep): IShortMove[] => {
    return moves.map((m: IMove) => {
      return {
        from: step.status,
        type: m.type,
        to: m.to,
        ...(m.requirements && m.requirements.fields
          ? {
              requirements: {
                fields: Array.isArray(m.requirements.fields)
                  ? m.requirements.fields
                  : Object.keys(m.requirements.fields),
              },
            }
          : {}),
      };
    });
  };

  const prepareMoves = (step: IStep) => {
    return reduceMoves(
      step.moves.filter((m) => rolesArr.includes(m.role)),
      step
    );
  };

  if (rolesArr.length === 1) {
    const role = rolesArr[0];
    // TODO: учитывать разные типы задач
    return getSteps(TASK_TYPE.FEAT).reduce((res, cur) => {
      // Если роли нет в списке ролей, которым доступен статус, то пропустить этот шаг
      if (!cur.column[role]) {
        return res;
      }

      const columnName = cur.column[rolesArr[0]];
      const columnIndex = res.findIndex((el) => el.column === columnName);
      if (columnIndex === -1) {
        res.push({
          column: columnName,
          statuses: [cur.status],
          moves: prepareMoves(cur),
        });
      } else {
        res[columnIndex].statuses.push(cur.status);
        res[columnIndex].moves = res[columnIndex].moves.concat(prepareMoves(cur));
      }
      return res;
    }, []);
  } else {
    return getSteps(TASK_TYPE.FEAT)
      .filter((step: IStep) => {
        return Boolean(intersection(Object.keys(step.column), rolesArr).length);
      })
      .map((el) => ({
        column: el.status,
        statuses: [el.status],
        moves: prepareMoves(el),
      }));
  }
}
