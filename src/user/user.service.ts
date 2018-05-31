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
import { RoleRepository } from '../@entities/role';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(RoleRepository) private readonly roleRepo: RoleRepository,
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
    const userRole = await this.roleRepo.findUserRole();
    const user = await this.userRepo.createEntity<InviteDto>(invite, [userRole]);
    const response = await this.mailService.sendInvite(user);
    // console.log(response);
    return user;
  }
}
