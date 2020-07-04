import { intersection } from 'lodash';

import { TASK_SIMPLE_STATUS } from '../../@orm/task/task-simple-status';
import { getColumns, roles as advancedRoles } from './advanced';
import { COLUMN_TYPE, IColumn } from './types/column-type';
import { IMove, MOVE_TYPE } from './types/move';
import { IRole, ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

export class TaskFlowStrategy {
  private readonly strategy: string;
  private readonly userRoles: ROLE | ROLE[];
  private _createdStatus?: STATUS_NAME;
  private _inProgressStatus?: STATUS_NAME;
  private _roles?: IRole[];
  private _columns?: IColumn[];
  private _userStrategyRoles?: ROLE[];
  private _defaultRole?: ROLE;
  private _availableStatuses?: STATUS_NAME[];

  constructor(strategyName: string, userRoles?: ROLE | ROLE[]) {
    this.strategy = strategyName;
    this.userRoles = userRoles;
  }

  get defaultRole(): ROLE {
    if (this._defaultRole) {
      return this._defaultRole;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._defaultRole = ROLE.DEVELOPER;
        break;
      }
      case TASK_FLOW_STRATEGY.SIMPLE: {
        this._defaultRole = ROLE.DEVELOPER;
        break;
      }
      default: {
        this._defaultRole = ROLE.DEVELOPER;
        break;
      }
    }

    return this._defaultRole;
  }

  /**
   * Возвращает роли пользователя, которые есть в данной стратегии.
   * Все роли, которых нет в стратегии, заменяются ролью, объявленной в стратегии, как роль по-умолчанию
   */
  get userStrategyRoles(): Array<ROLE> {
    if (this._userStrategyRoles) {
      return this._userStrategyRoles;
    }

    const rolesArr = Array.isArray(this.userRoles) ? this.userRoles : [this.userRoles];
    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        const existingRoles: ROLE[] = intersection<ROLE>(
          this.roles.map((el) => el.id),
          rolesArr
        );
        const defRole = this.defaultRole;
        this._userStrategyRoles =
          existingRoles.length === rolesArr.length
            ? existingRoles
            : existingRoles.includes(defRole)
            ? existingRoles
            : [...existingRoles, defRole];
        break;
      }
      case TASK_FLOW_STRATEGY.SIMPLE: {
        this._userStrategyRoles = [undefined];
        break;
      }
      default: {
        this._userStrategyRoles = [];
        break;
      }
    }

    return this._userStrategyRoles;
  }

  get columns(): Array<IColumn> {
    if (this._columns) {
      return this._columns;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._columns = getColumns(this.userStrategyRoles);
        break;
      }
      case TASK_FLOW_STRATEGY.SIMPLE: {
        this._columns = Object.values(TASK_SIMPLE_STATUS)
          .filter((el) => typeof el === 'number')
          .map((enumValue: number) => {
            const statusName = TaskFlowStrategy.statusToName(enumValue);
            return {
              column: statusName,
              moves:
                statusName === STATUS_NAME.DONE
                  ? [
                      {
                        type: MOVE_TYPE.ANY,
                        to: STATUS_NAME.ANY,
                        role: undefined,
                        requirements: {},
                      },
                    ]
                  : [
                      {
                        type: MOVE_TYPE.PUSH_FORWARD,
                        to: STATUS_NAME.TESTING,
                        role: undefined,
                        requirements: {},
                      },
                      {
                        type: MOVE_TYPE.ANY,
                        to: STATUS_NAME.ANY,
                        role: undefined,
                        requirements: {},
                      },
                    ],
              statuses: [statusName],
            };
          });
        break;
      }
    }

    return this._columns;
  }

  get availableStatuses(): STATUS_NAME[] {
    if (this._availableStatuses) {
      return this._availableStatuses;
    }

    return (this._availableStatuses = this.columns.reduce((res, cur) => {
      return res.concat(cur.statuses);
    }, []));
  }

  get roles(): Array<IRole> {
    if (this._roles) {
      return this._roles;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._roles = advancedRoles;
        break;
      }
      default: {
        this._roles = [];
        break;
      }
    }

    return this._roles;
  }

  getInProgressStatus(statusTypeName: STATUS_NAME): STATUS_NAME {
    if (this._inProgressStatus) {
      return this._inProgressStatus;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._inProgressStatus = statusTypeName;

        break;
      }
      default: {
        this._inProgressStatus = STATUS_NAME.READY_TO_DO;
        break;
      }
    }

    return this._inProgressStatus;
  }

  getCreatedStatus(taskStatusName?: STATUS_NAME | COLUMN_TYPE): STATUS_NAME {
    if (this._createdStatus) {
      return this._createdStatus;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.SIMPLE: {
        this._createdStatus = (taskStatusName as STATUS_NAME) || STATUS_NAME.READY_TO_DO;
        break;
      }
      case TASK_FLOW_STRATEGY.ADVANCED: {
        const userRoles = this.userStrategyRoles;
        if (userRoles.includes(ROLE.ARCHITECT)) {
          this._createdStatus = STATUS_NAME.CREATING;
          break;
        }

        if (userRoles.includes(ROLE.DEVELOPER)) {
          this._createdStatus = STATUS_NAME.ASSIGNING_RESPONSIBLE;
          break;
        }

        // По-умолчанию начальный статус - это статус для QA-инженера
        this._createdStatus = STATUS_NAME.ESTIMATION_BEFORE_TO_DO;

        break;
      }
      default: {
        this._createdStatus = STATUS_NAME.READY_TO_DO;
        break;
      }
    }

    return this._createdStatus;
  }

  pushForward(statusTypeName: STATUS_NAME): IMove | undefined {
    const step = this.columns.find((col) => col.statuses.includes(statusTypeName));
    if (step) {
      return Array.isArray(step.moves) ? step.moves.find((move) => move.type === MOVE_TYPE.PUSH_FORWARD) : undefined;
    }

    return undefined;
  }

  public canBeStarted(statusTypeName: STATUS_NAME) {
    return (
      this.columns.findIndex((col) => {
        return (
          col.statuses.includes(statusTypeName) &&
          col.moves.findIndex(
            (move) => move.type === MOVE_TYPE.PUSH_FORWARD && this.userStrategyRoles.includes(move.role)
          ) !== -1
        );
      }) !== -1
    );
  }

  public canBeMoved(fromStatus: STATUS_NAME | COLUMN_TYPE, toStatus: STATUS_NAME | COLUMN_TYPE): STATUS_NAME | false {
    let allowedMove: IMove | null = null;
    const toColumn = this.columns.find(
      (col) => col.column === toStatus || col.statuses.includes(toStatus as STATUS_NAME)
    );
    this.columns.forEach((col) => {
      if (col.column === fromStatus || col.statuses.includes(fromStatus as STATUS_NAME)) {
        const curMove = col.moves.find(
          (move) =>
            (toColumn.statuses.includes(move.to) || move.to === STATUS_NAME.ANY) &&
            (!this.userStrategyRoles.length || this.userStrategyRoles.includes(move.role))
        );

        if (curMove) {
          allowedMove = curMove;
        }
      }
    });
    if (this.strategy === TASK_FLOW_STRATEGY.SIMPLE) {
      return allowedMove ? (toStatus as STATUS_NAME) : false;
    }
    return allowedMove ? allowedMove.to : false;
  }

  // TODO: удалить, когда с UI будет приходить правильное значение
  static statusToName(status: number): STATUS_NAME {
    if (![0, 1, 3, 4].includes(status)) {
      throw new Error('Недопустимое значение');
    }

    return {
      0: STATUS_NAME.CREATING,
      1: STATUS_NAME.READY_TO_DO,
      3: STATUS_NAME.TESTING,
      4: STATUS_NAME.DONE,
    }[status];
  }

  static statusTypeNameToSimpleStatus(statusTypeName: STATUS_NAME): TASK_SIMPLE_STATUS {
    const res = {
      [STATUS_NAME.CREATING]: 0,
      [STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING]: 0,
      [STATUS_NAME.ASSIGNING_RESPONSIBLE]: 0,
      [STATUS_NAME.ESTIMATION_BEFORE_PERFORMER]: 0,
      [STATUS_NAME.ASSIGNING_PERFORMER]: 0,
      [STATUS_NAME.ESTIMATION_BEFORE_TO_DO]: 0,
      [STATUS_NAME.ASSIGNING_RESPONSIBLE]: 0,
      [STATUS_NAME.READY_TO_DO]: 1,
      [STATUS_NAME.AUTO_TESTING]: 3,
      [STATUS_NAME.PROF_REVIEW]: 3,
      [STATUS_NAME.ESTIMATION_BEFORE_TEST]: 3,
      [STATUS_NAME.READY_TO_TEST]: 3,
      [STATUS_NAME.TESTING]: 3,
      [STATUS_NAME.ARCHITECT_REVIEW]: 3,
      [STATUS_NAME.READY_TO_DEPLOY]: 4,
      [STATUS_NAME.DEPLOYING]: 4,
      [STATUS_NAME.DEPLOYED_PROF_ESTIMATION]: 4,
      [STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION]: 4,
      [STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION]: 4,
      [STATUS_NAME.DEPLOYED_ESTIMATION]: 4,
      [STATUS_NAME.DONE]: 4,
    }[statusTypeName];
    if (typeof res === 'number') {
      return res;
    }

    return 0;
  }
}
