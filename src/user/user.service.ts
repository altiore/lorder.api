import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserRepository, CreateUserDto } from '../@entities/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  public async findOne(id: number): Promise<User> {
    return await this.userRepo.findOneOrFail(id);
  }

  public async findOneByIdentifier(identifier: string): Promise<User> {
    return await this.userRepo.findByIdentifier(identifier);
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    user.status = 1;
    return await this.userRepo.save(user);
  }
}
