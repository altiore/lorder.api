import { parseDetail } from './parseDetailFromTypeormException';

describe('parseDetailFromTypeormException', () => {
  it('parseDetail', () => {
    expect(parseDetail('Key (email)=(razvanlomov@gmail.com) already exists.')[1]).toBe('email');
    expect(parseDetail('Key (email)=(razvanlomov@gmail.com) already exists.')[2]).toBe('razvanlomov@gmail.com');
    expect(parseDetail('Key (email)=(razvanlomov@gmail.com) already exists.')[3]).toBe('already exists');
  });
});
