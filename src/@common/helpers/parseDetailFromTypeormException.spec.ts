import { parseDetail } from './parseDetailFromTypeormException';

describe('parseDetailFromTypeormException', () => {
  it('parseDetail', () => {
    const res = parseDetail('Key (email)=(razvanlomov@gmail.com) already exists.');
    expect(res.property).toBe('email');
    expect(res.value).toBe('razvanlomov@gmail.com');
    expect(res.constraints).toEqual({
      isUnique: 'already exists',
    });
  });

  it('parseDetail Key (name)=(just-created) already exists.', () => {
    const res = parseDetail('Key (name)=(just-created) already exists.');
    expect(res.property).toBe('name');
    expect(res.value).toBe('just-created');
    expect(res.constraints).toEqual({
      isUnique: 'already exists',
    });
  });
});
