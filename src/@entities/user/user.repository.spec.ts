import { TypeormTestHelper } from '../../@common/test-helper/typeorm.test.helper';
import { UserRepository } from './user.repository';

describe('The UserRepository', () => {

  let tth: TypeormTestHelper;
  let userRepository: UserRepository;

  beforeEach(async () => {
    tth = new TypeormTestHelper();
    userRepository = await tth.create<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await tth.cancel();
  });

  it('createEntity', async () => {
    const result = await userRepository.createEntity({ identifier: 'test' });
    expect(result.status).toEqual(1);
  });
});