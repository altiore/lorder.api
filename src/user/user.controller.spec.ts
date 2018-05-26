import { TestingModule } from '@nestjs/testing';

import { MyTest } from '../testHelper/MyTest';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UsersController', async () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await MyTest.create([User], {
      controllers: [UserController],
      providers: [UserService],
    }, [
      {identifier: 'test1', status: 1, paymentMethod: 1, createdAt: new Date(), updateAt: new Date()},
      {identifier: 'test2', status: 1, paymentMethod: 1, createdAt: new Date(), updateAt: new Date()},
    ]);
  });

  // afterAll(() => {
  //   console.log('after all');
  // })

  describe('findOne', async () => {
    it('should return "Hello Users!"', async () => {
      const userController = app.get<UserController>(UserController);
      expect(await userController.findOne(1)).toMatchObject({id: 1});
    });
  });
});
