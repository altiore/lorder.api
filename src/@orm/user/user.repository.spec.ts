import { TypeormTestHelper } from '../typeorm.test.helper';
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
    const { user, password } = await userRepository.createWithRoles(
      {
        email: 'test',
      },
      []
    );
    expect(user.status).toEqual(1);
  });

  it('findByUsername', async () => {
    expect((await userRepository.findOneByEmail('test')).status).toBe(1);
  });

  it('updateEntity tel', async () => {
    const user = await userRepository.findOneByEmail('test');
    expect(
      (await userRepository.updateOne(user, {
        tel: '7777777777',
      })).tel
    ).toBe('7777777777');
    expect((await userRepository.find({ where: { tel: '7777777777' } })).length).toBe(1);
  });

  it('updateEntity email', async () => {
    const user = await userRepository.findOneByEmail('test');
    const newTes = '380997777777';
    expect(
      (await userRepository.updateOne(user, {
        tel: newTes,
      })).email
    ).toBe(user.email);
    expect((await userRepository.find({ where: { email: user.email } })).length).toBe(1);
  });
});
