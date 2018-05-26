import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from './project.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly userRepository: Repository<ProjectEntity>,
  ) {}

  public findAll(): Promise<ProjectEntity[]> {
    return this.userRepository.find();
  }

  public async findOne(id: number): Promise<ProjectEntity> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async findOneByIdentifier(identifier: string): Promise<ProjectEntity> {
    return await this.userRepository.findOne({ identifier });
  }

  public async create(createUserDto: CreateUserDto): Promise<ProjectEntity> {
    const user = this.userRepository.create(createUserDto);
    user.status = 1;
    return await this.userRepository.save(user);
  }
}
