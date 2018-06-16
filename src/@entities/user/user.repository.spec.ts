import { TypeormTestHelper } from '../../@common/test-helper/typeorm.test.helper';
import { UserRepository } from './user.repository';

const tth = new TypeormTestHelper();
let userRepository: UserRepository;

describe('The UserRepository', () => {
  beforeAll(async () => {
    [userRepository] = await tth.beforeAll(UserRepository);
  });

  afterAll(async () => {
    await tth.afterAll();
  });

  it('createEntity', async () => {
    const result = await userRepository.createEntity({ email: 'test', resetLink: 'test' });
    expect(result.status).toEqual(1);
  });

  it('findByUsername', async () => {
    expect((await userRepository.findOneByEmail('test')).status).toBe(1);
  });

  it('updateEntity tel', async () => {
    const user = await userRepository.findOneByEmail('test');
    expect((await userRepository.updateEntity(user, {
      tel: '7777777777',
    })).tel).toBe('7777777777');
    expect((await userRepository.find({where: { tel: '7777777777' }})).length).toBe(1);
  });

  it('updateEntity email', async () => {
    const user = await userRepository.findOneByEmail('test');
    const newEmail = 'testnew2@mail.com';
    expect((await userRepository.updateEntity(user, {
      email: newEmail,
    })).email).toBe(newEmail);
    expect((await userRepository.find({where: { email: newEmail }})).length).toBe(1);
  });
});
