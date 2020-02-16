import { createHash } from 'crypto';

import { createUsers } from '../../../../tests/@fixtureCreators';
import { ROLES } from '../../../@orm/role';

export const usersFixture = createUsers([
  {
    email: 'user+password@mail.com',
    password: createHash('md5')
      .update('correct password')
      .digest('hex'),
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'no-password@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'admin+password@mail.com',
    password: createHash('md5')
      .update('correct password')
      .digest('hex'),
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }],
  },
  {
    email: 'admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }],
  },
  {
    email: 'super-admin+password@mail.com',
    password: createHash('md5')
      .update('correct password')
      .digest('hex'),
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }, { name: ROLES.SUPER_ADMIN }],
  },
  {
    email: 'super-admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }, { name: ROLES.SUPER_ADMIN }],
  },
]);
