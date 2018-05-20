import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello Users!"', () => {
      const userController = app.get<UsersController>(UsersController);
      expect(userController.root()).toBe('Hello Users!');
    });
  });
});
