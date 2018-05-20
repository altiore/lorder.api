import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UsersController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello Users!"', () => {
      const userController = app.get<UserController>(UserController);
      expect(userController.root()).toBe('Hello Users!');
    });
  });
});
