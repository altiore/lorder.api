import { TaskFlowStrategy } from './task-flow-strategy';
import { COLUMN_TYPE } from './types/column-type';
import { ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

describe('task-flow-strategy', () => {
  let strategy;

  describe('steps', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('columns count', () => {
        expect(strategy.steps.length).toBe(4);
      });
    });

    describe('ADVANCED', () => {
      describe('ARCHITECT', () => {
        beforeEach(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT]);
        });
        it('columns count', () => {
          expect(strategy.steps.length).toBe(15);
        });
      });
    });
  });

  describe('columns', () => {
    describe('SIMPLE', () => {
      beforeEach(() => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
      });

      it('columns count', () => {
        expect(strategy.columns.length).toBe(4);
      });
    });

    describe('ADVANCED', () => {
      describe('ARCHITECT', () => {
        beforeEach(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT]);
        });
        it('columns count', () => {
          expect(strategy.columns.length).toBe(10);
        });
      });
    });
  });

  describe('SIMPLE strategy', () => {
    beforeEach(() => {
      strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.SIMPLE, []);
    });

    describe('canBeMoved', () => {
      it('from CREATING', () => {
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.TESTING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from READY_TO_DO', () => {
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.CREATING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.TESTING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.READY_TO_DO, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from TESTING', () => {
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.CREATING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.DONE)).toBeTruthy();
      });

      it('from DONE', () => {
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.CREATING)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.READY_TO_DO)).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.DONE, STATUS_NAME.TESTING)).toBeTruthy();
      });
    });

    describe('userStrategyRoles', () => {
      it('common', () => {
        expect(strategy.userStrategyRoles).toEqual([undefined]);
      });
    });

    describe('pushForward', () => {
      it('', () => {
        expect(strategy.pushForward());
      });
    });
  });

  describe('ADVANCED strategy', () => {
    describe('canBeMoved', () => {
      it('ARCHITECT', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.ARCHITECT);
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING)).toBeTruthy();
        expect(
          strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)
        ).toBeTruthy();
        expect(
          strategy.canBeMoved(STATUS_NAME.ASSIGNING_RESPONSIBLE, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)
        ).toBeTruthy();
        expect(strategy.canBeMoved(STATUS_NAME.CREATING, STATUS_NAME.ESTIMATION_BEFORE_PERFORMER)).toBeFalsy();
        expect(strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_PERFORMER, STATUS_NAME.CREATING)).toBeFalsy();
      });

      describe('TESTER', () => {
        beforeAll(() => {
          strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.TESTER);
        });

        it('TESTING -> ARCHITECT_REVIEW', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.ARCHITECT_REVIEW)).toBe(
            STATUS_NAME.ARCHITECT_REVIEW
          );
        });

        it('TESTING -> COLUMN_TYPE.REVIEWING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, COLUMN_TYPE.REVIEWING)).toBe(STATUS_NAME.ARCHITECT_REVIEW);
        });

        it('TESTING -> ESTIMATION_BEFORE_TO_DO', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, STATUS_NAME.ESTIMATION_BEFORE_TO_DO)).toBe(
            STATUS_NAME.ESTIMATION_BEFORE_TO_DO
          );
        });

        it('TESTING -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.TESTING, COLUMN_TYPE.DEVELOPING)).toBe(
            STATUS_NAME.ESTIMATION_BEFORE_TO_DO
          );
        });

        it('ESTIMATION_BEFORE_TO_DO -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.ESTIMATION_BEFORE_TO_DO, COLUMN_TYPE.DEVELOPING)).toBeFalsy();
        });

        it('ARCHITECT_REVIEW -> COLUMN_TYPE.DEVELOPING', () => {
          expect(strategy.canBeMoved(STATUS_NAME.ARCHITECT_REVIEW, COLUMN_TYPE.FINISHING)).toBeFalsy();
        });
      });
    });

    describe('userStrategyRoles', () => {
      it('ARCHITECT', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, ROLE.ARCHITECT);
        expect(strategy.userStrategyRoles.length).toBe(1);
        expect(strategy.userStrategyRoles).toEqual([ROLE.ARCHITECT]);
      });

      it('ARCHITECT + DEVELOPER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT, ROLE.DEVELOPER]);
        expect(strategy.userStrategyRoles.length).toBe(2);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.ARCHITECT, ROLE.DEVELOPER]));
      });

      it('ARCHITECT + DESIGNER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.ARCHITECT, ROLE.DESIGNER]);
        expect(strategy.userStrategyRoles.length).toBe(2);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.ARCHITECT, ROLE.DEVELOPER]));
      });

      it('FE_DEVELOPER', () => {
        strategy = new TaskFlowStrategy(TASK_FLOW_STRATEGY.ADVANCED, [ROLE.FE_DEVELOPER]);
        expect(strategy.userStrategyRoles.length).toBe(1);
        expect(strategy.userStrategyRoles).toEqual(expect.arrayContaining([ROLE.DEVELOPER]));
      });
    });
  });
});
