import { TypeormTestHelper } from '../../@common/test-helper/typeorm.test.helper';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { RoleRepository } from '../role/role.repository';
import { ProjectRepository } from './project.repository';

const tth = new TypeormTestHelper();
let userRepository: UserRepository;
let projectRepo: ProjectRepository;
let roleRepo: RoleRepository;
let user: User;

describe('The ProjectRepository', () => {
  beforeAll(async () => {
    [projectRepo, userRepository, roleRepo] = await tth.beforeAll(ProjectRepository, UserRepository, RoleRepository);
    user = await tth.createUser(userRepository, roleRepo);
  });

  afterAll(async () => {
    await tth.afterAll();
  });

  it('createEntity', async () => {
    const result = await projectRepo.createByUser({ title: 'testProject', monthlyBudget: 1000 }, user);
    expect(result.createdAt).not.toBeUndefined();
    expect(result.createdAt).not.toBeNull();
    expect(result.createdAt).not.toBe('');
    expect(result.title).toBe('testProject');
    expect(result.monthlyBudget).toBe(1000);
  });

  it('findOneByOwner', async () => {
    const project = await projectRepo.createByUser({ title: 'testProject2', monthlyBudget: 10000 }, user);
    const result = await projectRepo.findOneByOwner(project.id, user);
    expect(result.createdAt).not.toBeUndefined();
    expect(result.createdAt).not.toBeNull();
    expect(result.createdAt).not.toBe('');
    expect(result.title).toBe('testProject2');
    expect(result.monthlyBudget).toBe(10000);
  });

  it('findOneByOwner should throw error due to wrong owner', async () => {
    const wrongUser = await userRepository.createEntity({email: 'wrong@mail.com', resetLink: 'test'});
    const project = await projectRepo.createByUser({ title: 'testProject2', monthlyBudget: 10000 }, wrongUser);
    await expect(projectRepo.findOneByOwner(project.id, user)).rejects.toBeInstanceOf(Error);
  });
});
