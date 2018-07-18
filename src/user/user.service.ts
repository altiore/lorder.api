import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserRepository, CreateUserDto, LoginUserDto } from '../@orm/user';
import { UpdateUserDto } from '../@orm/user/dto';
import { RoleRepository } from '../@orm/role';
import { MailService } from '../mail/mail.service';

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

  public findUserByEmail(email: string, withPassword: boolean = false): Promise<User> {
    return this.userRepo.findOneByEmail(email, withPassword);
  }

  public findActiveUserByEmail(email: string) {
    return this.userRepo.findOneActiveByEmail(email);
  }

  public async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = this.userRepo.validatePassword(loginUserDto);
    if (!user) {
      throw new NotFoundException(`Пользователь с email-адресом ${loginUserDto.email} не был найден`);
    }
    return user as Promise<User>;
  }

  public update(user: User, data: UpdateUserDto): Promise<User> {
    return this.userRepo.updateEntity(user, data);
  }

  public activateByResetLink(resetLink: string) {
    return this.userRepo.activateByResetLink(resetLink);
  }

  public async createUser(data: CreateUserDto) {
    const userRole = await this.roleRepo.findUserRole();
    return await this.userRepo.createWithRoles(data, [userRole]);
  }

  public async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
    return;
  }

  public async exists(email): Promise<boolean> {
    return !!(await this.userRepo.findOne({ where: { email }, select: ['id'] }));
  }
}
