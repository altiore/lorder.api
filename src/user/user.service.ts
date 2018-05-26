import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserRepository, CreateUserDto } from '../@entities/user';
import { UpdateUserDto } from '../@entities/user/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  public findOne(id: number): Promise<User> {
    return this.userRepo.findOneOrFail(id);
  }

  public findOneByIdentifier(identifier: string): Promise<User> {
    return this.userRepo.findByIdentifier(identifier);
  }

  public create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepo.createEntity(createUserDto);
  }

  public update(user: User, data: UpdateUserDto): Promise<User> {
    return this.userRepo.updateEntity(user, data);
  }
}
