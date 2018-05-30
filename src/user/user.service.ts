import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  User,
  UserRepository,
  CreateUserDto,
  InviteDto,
} from '../@entities/user';
import { UpdateUserDto } from '../@entities/user/dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly mailService: MailService,
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

  public async invite(invite: InviteDto): Promise<User> {
    const user = await this.userRepo.createEntity<InviteDto>(invite);
    const response = await this.mailService.sendInvite(user);
    // console.log(response);
    return user;
  }
}
