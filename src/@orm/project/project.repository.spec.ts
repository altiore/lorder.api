import { TypeormTestHelper } from '../typeorm.test.helper';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

import { ProjectRepository } from './project.repository';

const tth = new TypeormTestHelper();
let userRepository: UserRepository;
let projectRepo: ProjectRepository;
let user: User;

describe('The ProjectRepository', () => {
  beforeAll(async () => {
    [projectRepo, userRepository] = await tth.beforeAll(ProjectRepository, UserRepository);
    user = await userRepository.findOneByEmail('razvanlomov@gmail.com');
  });

  afterAll(async () => {
    await tth.afterAll();
  });

  it('createEntity', async () => {
    const result = await projectRepo.createByUser({ title: 'testProject', monthlyBudget: 1000 }, user);
    expect(result.createdAt).toBeTruthy();
    expect(result.title).toBe('testProject');
    expect(result.monthlyBudget).toBe(1000);
    await projectRepo.delete({ id: result.id });
  });
});
