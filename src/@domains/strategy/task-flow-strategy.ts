import { TASK_SIMPLE_STATUS } from '../../@orm/task/task-simple-status';
import { getColumns, roles as advancedRoles } from './advanced';
import { IColumn } from './types/column-type';
import { IRole, ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

export class TaskFlowStrategy {
  private readonly strategy: string;
  private readonly userRoles: ROLE | ROLE[];

  constructor(strategyName: string, userRoles?: ROLE | ROLE[]) {
    this.strategy = strategyName;
    this.userRoles = userRoles;
  }

  get columns(): Array<IColumn> {
    if (this.strategy === TASK_FLOW_STRATEGY.ADVANCED) {
      return getColumns(this.userRoles);
    }

    return Object.values(TASK_SIMPLE_STATUS)
      .filter((el) => typeof el === 'number')
      .map((enumValue: number) => ({
        column: TaskFlowStrategy.statusToName(enumValue),
        moves: true,
        statuses: [TaskFlowStrategy.statusToName(enumValue)],
      }));
  }

  get roles(): Array<IRole> {
    switch (this.strategy) {
      case TASK_FLOW_STRATEGY.ADVANCED: {
        return advancedRoles;
      }
      default: {
        return [];
      }
    }
  }

  static statuses: { [key in keyof typeof TASK_SIMPLE_STATUS]: TASK_SIMPLE_STATUS } = {
    JUST_CREATED: 0,
    TO_DO: 1,
    IN_PROGRESS: 2,
    IN_TESTING: 3,
    DONE: 4,
  };

  // TODO: удалить, когда с UI будет приходить правильное значение
  static statusToName(status: number): STATUS_NAME {
    if (![0, 1, 2, 3, 4].includes(status)) {
      throw new Error('Недопустимое значение');
    }

    return [
      STATUS_NAME.CREATING,
      STATUS_NAME.READY_TO_DO,
      STATUS_NAME.IN_PROGRESS,
      STATUS_NAME.TESTING,
      STATUS_NAME.DONE,
    ][status];
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
      [STATUS_NAME.IN_PROGRESS]: 2,
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
