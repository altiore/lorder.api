import { createUsers } from '../../@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'user@mail.com',
    roles: [{ name: 'user' }],
  },
  {
    email: 'admin@mail.com',
    roles: [{ name: 'user' }, { name: 'admin' }],
  },
  {
    email: 'super-admin@mail.com',
    roles: [{ name: 'user' }, { name: 'admin' }, { name: 'super-admin' }],
  },
]);
