import { ROLE, STATUS_NAME } from '../types';
import { stepColumn } from './steps';

describe('steps', () => {
  describe('stepColumn', () => {
    it('STATUS_NAME.CREATING', () => {
      expect(stepColumn(STATUS_NAME.CREATING)).toEqual(
        expect.objectContaining({
          [ROLE.ARCHITECT]: STATUS_NAME.CREATING,
          [ROLE.DEVELOPER]: STATUS_NAME.CREATING,
          [ROLE.TESTER]: STATUS_NAME.CREATING,
          [ROLE.DESIGNER]: STATUS_NAME.CREATING,
        })
      );
    });

    it('STATUS_NAME.CREATING', () => {
      expect(stepColumn(STATUS_NAME.READY_TO_DO)).toEqual(
        expect.objectContaining({
          [ROLE.ARCHITECT]: STATUS_NAME.READY_TO_DO,
          [ROLE.DEVELOPER]: STATUS_NAME.READY_TO_DO,
          [ROLE.TESTER]: STATUS_NAME.READY_TO_DO,
          [ROLE.DESIGNER]: STATUS_NAME.READY_TO_DO,
        })
      );
    });

    it('STATUS_NAME.CREATING', () => {
      expect(stepColumn(STATUS_NAME.READY_TO_DO)).toEqual(
        expect.objectContaining({
          [ROLE.ARCHITECT]: STATUS_NAME.READY_TO_DO,
          [ROLE.DEVELOPER]: STATUS_NAME.READY_TO_DO,
          [ROLE.TESTER]: STATUS_NAME.READY_TO_DO,
          [ROLE.DESIGNER]: STATUS_NAME.READY_TO_DO,
        })
      );
    });

    it('STATUS_NAME.TESTING', () => {
      expect(stepColumn(STATUS_NAME.TESTING)).toEqual(
        expect.objectContaining({
          [ROLE.ARCHITECT]: STATUS_NAME.TESTING,
          [ROLE.DEVELOPER]: STATUS_NAME.TESTING,
          [ROLE.TESTER]: STATUS_NAME.TESTING,
          [ROLE.DESIGNER]: STATUS_NAME.TESTING,
        })
      );
    });

    it('STATUS_NAME.DONE', () => {
      expect(stepColumn(STATUS_NAME.DONE)).toEqual(
        expect.objectContaining({
          [ROLE.ARCHITECT]: STATUS_NAME.DONE,
          [ROLE.DEVELOPER]: STATUS_NAME.DONE,
          [ROLE.TESTER]: STATUS_NAME.DONE,
          [ROLE.DESIGNER]: STATUS_NAME.DONE,
        })
      );
    });
  });
});
