import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { ValidationException } from '../@common/exceptions/validation.exception';
import moment = require('moment');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async findOneByIdentifier(identifier: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ identifier });
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    user.status = 1;
    return await this.userRepository.save(user);
  }
}
