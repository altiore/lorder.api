import { createUserProjects } from '../../../@test-helper/@fixtureCreators';

export const userProjectsFixture = createUserProjects([
  {
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'with-project@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
]);
