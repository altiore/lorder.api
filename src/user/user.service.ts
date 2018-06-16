import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';

import {
  User,
  UserRepository,
  CreateUserDto,
  InviteDto, LoginUserDto,
} from '../@entities/user';
import { UpdateUserDto } from '../@entities/user/dto';
import { MailService } from '../mail/mail.service';
import { RoleRepository } from '../@entities/role';
import { ValidationException } from '../@common/exceptions/validation.exception';
import { async } from 'rxjs/internal/scheduler/async';

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

  public findOneByIdentifier(username: string, withPassword: boolean = false): Promise<User> {
    return this.userRepo.findByIdentifier(username, withPassword);
  }

  public create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepo.createEntity(createUserDto);
  }

  public async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.findOneByIdentifier(loginUserDto.username, true);
    if (!user) {
      throw new NotFoundException(`User with username ${loginUserDto.username} does not found`);
    }
    if (!this.validatePassword(user, loginUserDto.password)) {
      throw new ValidationException([
        {
          property: 'password',
          children: [],
          constraints: {
            isInvalid: 'Password is invalid',
          },
        },
      ]);
    }
    return user;
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

  private validatePassword(user: User, password: string) {
    return createHash('md5').update(password).digest('hex') === user.password;
  }
}
