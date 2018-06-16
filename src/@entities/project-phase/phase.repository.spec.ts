import { TypeormTestHelper } from '../../@common/test-helper/typeorm.test.helper';

const tth = new TypeormTestHelper();

describe('The PhaseRepository', () => {
  beforeAll(async () => {
    [] = await tth.beforeAll();
  });

  afterAll(async () => await tth.afterAll());

  it('mock test', () => {
    expect(true).toBeTruthy();
  });
});
