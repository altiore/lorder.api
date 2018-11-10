import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
// @see https://github.com/emerleite/node-gravatar
const gravatar = require('gravatar');

import { ProjectRepository } from '../@orm/project';
import { RoleRepository } from '../@orm/role';
import { UpdateUserDto, User, UserRepository } from '../@orm/user';
import { ACCESS_LEVEL, UserProjectRepository } from '../@orm/user-project';
import { UserDto, UserPaginationDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(RoleRepository) private readonly roleRepo: RoleRepository,
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository
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

  public async createUser(data: DeepPartial<User>): Promise<{ user: User; password?: string }> {
    const userRole = await this.roleRepo.findUserRole();
    data.avatar = gravatar.url(data.email, undefined, true);
    const res = await this.userRepo.createWithRoles(data, [userRole]);

    // TODO: user ProjectService.create method instead
    const project = await this.projectRepo.createByUser(
      {
        monthlyBudget: 0,
        title: 'Без проекта',
      },
      res.user
    );
    await this.userProjectRepo.addToProject(project, res.user, res.user, ACCESS_LEVEL.VIOLET);
    await this.userRepo.updateOne(res.user, { defaultProjectId: project.id });
    return res;
  }

  public async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
    return;
  }

  public async exists(email): Promise<boolean> {
    return !!(await this.userRepo.findOne({ where: { email }, select: ['id'] }));
  }
}
