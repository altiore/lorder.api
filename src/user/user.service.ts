import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';

import { RoleRepository } from '../@orm/role';
import { UpdateUserDto, User, UserRepository } from '../@orm/user';
import { UserDto, UserPaginationDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(RoleRepository) private readonly roleRepo: RoleRepository
  ) {}

  public findAll(pagesDto: UserPaginationDto): Promise<User[]> {
    try {
      return this.userRepo.findWithPagination(pagesDto);
    } catch (e) {
      throw new NotFoundException('Пользователи не найдены');
    }
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

  public async updateUserById(userId: number, data: UserDto): Promise<User> {
    const user = await this.userRepo.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с id: ${userId} не найден`);
    }
    user.roles = await this.roleRepo.findRolesByName(data.role);
    return await this.userRepo.save(user);
  }

  public updateUser(user: User, data: UpdateUserDto): Promise<User> {
    return this.userRepo.updateOne(user, data);
  }

  public unsafeUpdate(user: User, data: DeepPartial<User>): Promise<User> {
    return this.userRepo.updateOne(user, data);
  }

  public async createUser(data: DeepPartial<User>) {
    const userRole = await this.roleRepo.findUserRole();
    return this.userRepo.createWithRoles(data, [userRole]);
  }

  public async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
    return;
  }

  public async exists(email): Promise<boolean> {
    return !!(await this.userRepo.findOne({ where: { email }, select: ['id'] }));
  }
}
