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

  it('findOneByOwner', async () => {
    user = await userRepository.findOneByEmail('razvanlomov@gmail.com');
    expect(user.id).toBe(1);
    const project = await projectRepo.createByUser({ title: 'testProject2', monthlyBudget: 10000 }, user);
    const result = await projectRepo.findOneByOwner(project.id, user);
    expect(result.createdAt).toBeTruthy();
    expect(result.title).toBe('testProject2');
    expect(result.monthlyBudget).toBe(10000);
    await projectRepo.delete({ id: project.id });
  });

  it('findOneByOwner should throw error due to wrong owner', async () => {
    user = await userRepository.findOneByEmail('razvanlomov@gmail.com');
    const { user: wrongUser, password } = await userRepository.createWithRoles(
      {
        email: 'wrong@mail.com',
      },
      []
    );
    const project = await projectRepo.createByUser({ title: 'testProject2', monthlyBudget: 10000 }, wrongUser);
    await expect(projectRepo.findOneByOwner(project.id, user)).rejects.toBeInstanceOf(Error);
    await userRepository.delete({ id: wrongUser.id });
    await projectRepo.delete({ id: project.id });
  });
});
