import { TestHelper } from '../@utils/TestHelper';

describe(`TestHelper`, () => {
  let h: TestHelper;

  it('create url', () => {
    h = new TestHelper('/users');
    expect(h.url).toBe('/users');
  });

  it('create path with one params', () => {
    h = new TestHelper('/users/:userId');
    expect(h.path(1)).toBe('/users/1');
  });

  it('create path with many params', () => {
    h = new TestHelper('/users/:userId/projects/:projectId');
    expect(h.path(1, '55')).toBe('/users/1/projects/55');
  });

  it('create path with very many params', () => {
    h = new TestHelper('/users/:userId/projects/:projectId/next/:next/second/:second');
    expect(h.path(1, '55', 4, '2')).toBe('/users/1/projects/55/next/4/second/2');
  });
});
