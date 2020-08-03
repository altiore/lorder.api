import { chain, intersection } from 'lodash';

import { TASK_SIMPLE_STATUS } from '../../@orm/task/task-simple-status';
import { getColumns, getSteps as getAdvancedSteps, roles as advancedRoles } from './advanced';
import { columns as simpleColumns, steps as simpleSteps } from './simple';
import {
  COLUMN_TYPE,
  IColumn,
  IDetailedRole,
  IMove,
  IMoveError,
  IRole,
  IStep,
  IValidator,
  MOVE_TYPE,
  ROLE,
  STATUS_NAME,
  TASK_FLOW_STRATEGY,
  TASK_TYPE,
} from './types';

export interface IStrategyPublic {
  canStartStatuses: STATUS_NAME[];
  strategy: TASK_FLOW_STRATEGY;
  defaultRole: ROLE;
  roles: IRole[];
  userRoles: IDetailedRole[];
}

export class TaskFlowStrategy {
  private readonly userRoles: ROLE | ROLE[];
  readonly strategy: TASK_FLOW_STRATEGY;
  private _createdStatus?: STATUS_NAME;
  private _inProgressStatus?: STATUS_NAME;
  private _roles?: IRole[];
  private _columns?: IColumn[];
  private _userStrategyRoles?: ROLE[];
  private _defaultRole?: ROLE;
  private _availableStatuses?: STATUS_NAME[];
  private _steps: IStep[];

  constructor(strategyName: TASK_FLOW_STRATEGY, userRoles?: ROLE | ROLE[]) {
    this.strategy = strategyName;
    this.userRoles = userRoles;
  }

  get public(): IStrategyPublic {
    return {
      canStartStatuses: this.canStartStatuses,
      defaultRole: this.defaultRole,
      roles: this.roles,
      strategy: this.strategy,
      userRoles: this.detailedRoles,
    };
  }

  get data() {
    const userRoles = this.userStrategyRoles;
    return {
      columns: chain(userRoles).keyBy().mapValues(this.getRoleColumns.bind(this)).value(),
      userRoles,
    };
  }

  get steps(): IStep[] {
    if (this._steps) {
      return this._steps;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        this._steps = getAdvancedSteps(TASK_TYPE.FEAT);
        break;
      }
      case TASK_FLOW_STRATEGY.SIMPLE: {
        this._steps = simpleSteps;
        break;
      }
      default: {
        this._steps = [];
      }
    }

    return this._steps;
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
      case TASK_FLOW_STRATEGY.ADVANCED:
        const existingRoles: ROLE[] = intersection<ROLE>(
          this.roles.map((el) => el.id),
          rolesArr
        );
        const defRole = this.defaultRole;
        this._userStrategyRoles =
          rolesArr.length && existingRoles.length === rolesArr.length
            ? existingRoles
            : existingRoles.includes(defRole)
            ? existingRoles
            : [...existingRoles, defRole];

        break;
      case TASK_FLOW_STRATEGY.SIMPLE:
        this._userStrategyRoles = [undefined];
        break;
      default:
        this._userStrategyRoles = [];
        break;
    }

    return this._userStrategyRoles;
  }

  get detailedRoles(): IDetailedRole[] {
    return this.userStrategyRoles.map((role) => ({
      ...this.roles.find((r) => r.id === role),
      columns: this.getRoleColumns(role),
    }));
  }

  get columns(): Array<IColumn> {
    if (this._columns) {
      return this._columns;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED:
        this._columns = getColumns(this.userStrategyRoles);
        break;
      case TASK_FLOW_STRATEGY.SIMPLE:
        this._columns = simpleColumns;
        break;
    }

    return this._columns;
  }

  getRoleColumns(role: ROLE): Array<IColumn> {
    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED:
        return getColumns(role);
      case TASK_FLOW_STRATEGY.SIMPLE:
        return simpleColumns;
      default:
        return [];
    }
  }

  get availableStatuses(): STATUS_NAME[] {
    if (this._availableStatuses) {
      return this._availableStatuses;
    }

    return (this._availableStatuses = this.columns.reduce((res, cur) => {
      return res.concat(cur.statuses);
    }, []));
  }

  get canStartStatuses(): STATUS_NAME[] {
    if (this._availableStatuses) {
      return this._availableStatuses;
    }

    return (this._availableStatuses = this.columns.reduce((res, cur) => {
      if (cur.moves.find((el) => el.type === MOVE_TYPE.PUSH_FORWARD)) {
        return res.concat(cur.statuses);
      }

      return res;
    }, []));
  }

  get roles(): Array<IRole> {
    if (this._roles) {
      return this._roles;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED:
        this._roles = advancedRoles;
        break;
      case TASK_FLOW_STRATEGY.SIMPLE:
        this._roles = [];
        break;
      default:
        this._roles = [];
        break;
    }

    return this._roles;
  }

  getInProgressStatus(statusTypeName: STATUS_NAME): STATUS_NAME {
    if (this._inProgressStatus) {
      return this._inProgressStatus;
    }

    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED:
        this._inProgressStatus = statusTypeName;
        break;
      case TASK_FLOW_STRATEGY.SIMPLE:
        this._inProgressStatus = STATUS_NAME.READY_TO_DO;
        break;
      default:
        this._inProgressStatus = STATUS_NAME.READY_TO_DO;
        break;
    }

    return this._inProgressStatus;
  }

  getCreatedStatus(taskStatusName?: STATUS_NAME | COLUMN_TYPE): STATUS_NAME {
    if (this._createdStatus) {
      return this._createdStatus;
    }

    let createdStatus: STATUS_NAME;
    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.SIMPLE:
        createdStatus = (taskStatusName as STATUS_NAME) || STATUS_NAME.READY_TO_DO;
        break;
      case TASK_FLOW_STRATEGY.ADVANCED:
        const userRoles = this.userStrategyRoles;
        if (userRoles.includes(ROLE.ARCHITECT)) {
          createdStatus = this.roles.find((r) => r.id === ROLE.ARCHITECT)?.createdStatus;
          break;
        }

        if (userRoles.includes(ROLE.DEVELOPER)) {
          createdStatus = this.roles.find((r) => r.id === ROLE.DEVELOPER)?.createdStatus;
          break;
        }

        // По-умолчанию начальный статус - это статус для QA-инженера (ROLE.TESTER)
        createdStatus = this.roles.find((r) => r.id === ROLE.TESTER)?.createdStatus;

        break;
      default:
        createdStatus = STATUS_NAME.READY_TO_DO;
        break;
    }

    if (this.steps.findIndex((s) => s.status === createdStatus) === -1) {
      throw new Error(`Запрещенный тип статуса ${createdStatus}!`);
    }

    return (this._createdStatus = createdStatus);
  }

  pushForward(
    statusTypeName: STATUS_NAME,
    dataObject: object,
    finalStatus?: STATUS_NAME,
    prevMove?: IMove
  ): [IMove | undefined, Array<IMoveError>] {
    const step = this.steps.find((s) => s.status === statusTypeName);

    if (!step) {
      return [undefined, []];
    }

    const resultMove = Array.isArray(step.moves)
      ? step.moves.find((m) => {
          return m.type === MOVE_TYPE.PUSH_FORWARD && (m.role === undefined || this.userStrategyRoles.includes(m.role));
        })
      : undefined;

    if (!resultMove) {
      return [undefined, []];
    }

    let errors: Array<IMoveError> = [];
    if (resultMove.requirements) {
      if (resultMove.requirements.fields) {
        errors = this.validateFields(resultMove.requirements.fields, dataObject);
      }
      if (finalStatus && finalStatus === resultMove.to) {
        return [resultMove, errors];
      }
      if (resultMove.requirements.transit && !errors.length) {
        return this.pushForward(resultMove.to, dataObject, finalStatus, resultMove);
      }
    }

    if (errors.length && prevMove) {
      return [prevMove, []];
    }

    return [resultMove, errors];
  }

  private validateFields(fields: { [key in string]: IValidator[] }, dataObject: object): Array<IMoveError> {
    const errors: Array<IMoveError> = [];
    Object.keys(fields).forEach((property) => {
      fields[property].forEach((validate: IValidator) => {
        const value = dataObject[property];
        const constraints = validate(property, value);
        if (constraints) {
          const index = errors.findIndex((el) => Boolean(el.property === property));
          if (index !== -1) {
            errors[index].constraints = { ...errors[index].constraints, ...constraints };
          } else {
            errors.push({ property, constraints, value });
          }
        }
      });
    });

    return errors;
  }

  public canBeStarted(statusTypeName: STATUS_NAME) {
    return (
      this.steps.findIndex((col) => {
        return (
          col.status === statusTypeName &&
          col.moves.findIndex(
            (move) => move.type === MOVE_TYPE.PUSH_FORWARD && this.userStrategyRoles.includes(move.role)
          ) !== -1
        );
      }) !== -1
    );
  }

  public canBeMoved(
    fromStatus: STATUS_NAME,
    toStatus: STATUS_NAME | COLUMN_TYPE,
    dataObject: object = {},
    selectedRole?: ROLE
  ): STATUS_NAME | false {
    const columns = selectedRole ? this.getRoleColumns(selectedRole) : this.columns;
    const toColumn = columns.find((col) => {
      return col.column === toStatus || col.statuses.includes(toStatus as STATUS_NAME);
    });
    if (!toColumn) {
      return false;
    }

    const fromStep = this.steps.find((step) => step.status === fromStatus);
    if (!fromStep) {
      return false;
    }

    const allowedMove: IMove | null = fromStep.moves.find((move) => {
      return (
        (move.to === undefined || toColumn.statuses.includes(move.to)) &&
        (move.role === undefined || this.userStrategyRoles.includes(move.role))
      );
    });

    if (allowedMove) {
      if (allowedMove.type === MOVE_TYPE.PUSH_FORWARD) {
        const [resMove] = this.pushForward(fromStatus, dataObject, allowedMove.to);
        if (resMove && resMove.to === allowedMove.to) {
          return resMove.to;
        }
        return false;
      }
      return allowedMove.to;
    }

    return false;
  }

  getIsTransit(currentStatus: STATUS_NAME) {
    const currentStep = this.steps.find((s) => s.status === currentStatus);
    if (currentStep) {
      const pushForwardMove = currentStep.moves.find((move) => {
        return move.type === MOVE_TYPE.PUSH_FORWARD && this.userStrategyRoles.includes(move.role);
      });
      if (pushForwardMove) {
        return Boolean(pushForwardMove?.requirements?.transit);
      }
    }

    return false;
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
