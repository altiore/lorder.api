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
    const result = await userRepository.createEntity({ identifier: 'test' });
    expect(result.status).toEqual(1);
  });

  it('findByIdentifier', async () => {
    expect((await userRepository.findByIdentifier('test')).status).toBe(1);
  });

  it('updateEntity email', async () => {
    const user = await userRepository.findByIdentifier('test');
    expect((await userRepository.updateEntity(user, {
      email: 'test@mail.com',
    })).email).toBe('test@mail.com');
    expect((await userRepository.find({where: { email: 'test@mail.com' }})).length).toBe(1);
  });

  it('updateEntity tel', async () => {
    const user = await userRepository.findByIdentifier('test');
    expect((await userRepository.updateEntity(user, {
      tel: '7777777777',
    })).tel).toBe('7777777777');
    expect((await userRepository.find({where: { tel: '7777777777' }})).length).toBe(1);
  });
});
