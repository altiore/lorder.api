import { TASK_SIMPLE_STATUS } from '../../@orm/task/task-simple-status';
import { getColumns, roles as advancedRoles } from './advanced';
import { IColumn } from './types/column-type';
import { IMove, MOVE_TYPE } from './types/move';
import { IRole, ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

export class TaskFlowStrategy {
  private readonly strategy: string;
  private readonly userRoles: ROLE | ROLE[];
  private _startedStatus?: { status: number; statusTypeName: STATUS_NAME };
  private _roles?: IRole[];
  private _columns?: IColumn[];

  constructor(strategyName: string, userRoles?: ROLE | ROLE[]) {
    this.strategy = strategyName;
    this.userRoles = userRoles;
  }

  get columns(): Array<IColumn> {
    if (this._columns) {
      return this._columns;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._columns = getColumns(this.userRoles);
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

  get startedStatus(): { status: number; statusTypeName: STATUS_NAME } {
    if (this._startedStatus) {
      return this._startedStatus;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._startedStatus = {
          status: TaskFlowStrategy.statusTypeNameToSimpleStatus(STATUS_NAME.READY_TO_DO),
          statusTypeName: STATUS_NAME.READY_TO_DO,
        };
        break;
      }
      default: {
        this._startedStatus = {
          status: TaskFlowStrategy.statusTypeNameToSimpleStatus(STATUS_NAME.READY_TO_DO),
          statusTypeName: STATUS_NAME.READY_TO_DO,
        };
        break;
      }
    }

    return this._startedStatus;
  }

  pushForward(task: { statusTypeName: STATUS_NAME }): IMove | undefined {
    const step = this.columns.find((col) => col.statuses.includes(task.statusTypeName));
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
          col.moves.findIndex((move) => move.type === MOVE_TYPE.PUSH_FORWARD) !== -1
        );
      }) !== -1
    );
  }

  public canBeMoved(fromStatus: STATUS_NAME, toStatus: STATUS_NAME) {
    console.log('canBeMoved', { columns: this.columns });
    return (
      this.columns.findIndex((col) => {
        return (
          col.statuses.includes(fromStatus) &&
          col.moves.findIndex((move) => move.to === toStatus || move.to === STATUS_NAME.ANY) !== -1
        );
      }) !== -1
    );
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
