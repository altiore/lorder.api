import { TaskFlowStrategy } from './task-flow-strategy';
import { ROLE } from './types/role';
import { STATUS_NAME } from './types/status';
import { TASK_FLOW_STRATEGY } from './types/task-flow-strategy';

describe('task-flow-strategy', () => {
  let strategy;

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
      });
    });
  });
});
