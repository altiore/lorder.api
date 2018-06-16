import { parseDetail } from './parseDetailFromTypeormException';

describe('parseDetailFromTypeormException', () => {
  it('parseDetail', () => {
    expect(parseDetail('Key (username)=(razvanlomov@gmail.com) already exists.')[1]).toBe('username');
    expect(parseDetail('Key (username)=(razvanlomov@gmail.com) already exists.')[2]).toBe('razvanlomov@gmail.com');
    expect(parseDetail('Key (username)=(razvanlomov@gmail.com) already exists.')[3]).toBe('already exists');
  });
});
