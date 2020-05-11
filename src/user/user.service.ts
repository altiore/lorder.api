import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, MEDIA_TYPE } from '@orm/media';
import { Project, PROJECT_TYPE } from '@orm/project';
import { RoleRepository } from '@orm/role';
import { UpdateUserDto, User, UserRepository } from '@orm/user';
import { DeepPartial, EntityManager } from 'typeorm';

import { UserRole } from '../@orm/user-role/user-role.entity';
import { FileService } from '../file/file.service';
import { ProjectService } from '../project/project.service';

import { UserDto, UserPaginationDto } from './dto';
// @see https://github.com/emerleite/node-gravatar
const gravatar = require('gravatar');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(RoleRepository) private readonly roleRepo: RoleRepository,
    private readonly projectService: ProjectService,
    private readonly fileService: FileService
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
    const roles = await this.roleRepo.findRolesByName(data.role);
    user.userRoles = roles.map(el => {
      const m = new UserRole();
      m.role = el;
      return m;
    });
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

    const res = await this.userRepo.createWithRoles(data, [userRole]);
    await this.createDefaultProject(res.user);
    await this.addAvatar(res.user);
    return res;
  }

  public async createDefaultProject(user: User, manager?: EntityManager): Promise<Project> {
    const curManager = manager || this.userRepo.manager;
    const project = await this.projectService.create(
      {
        monthlyBudget: 0,
        title: 'Без проекта',
        type: PROJECT_TYPE.PERSONALLY_USEFUL,
      },
      user,
      curManager
    );
    await curManager.update(User, { id: user.id }, { defaultProjectId: project.id });
    return project;
  }

  public async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
    return;
  }

  public async exists(email): Promise<boolean> {
    return !!(await this.userRepo.findOne({ where: { email }, select: ['id'] }));
  }

  public async updateAvatar(file: any, user: User): Promise<Media> {
    if (!user.avatar) {
      await this.addAvatar(user);
    }
    return this.fileService.updateOrCreateObjInGoogleCloudStorage(file, user.avatar);
  }

  private async addAvatar(user: User): Promise<User> {
    user.avatar = await this.fileService.createOne({
      title: `User avatar ${user.email}`,
      type: MEDIA_TYPE.IMAGE,
      url: gravatar.url(user.email, undefined, true),
    });

    await this.userRepo.update({ id: user.id }, { avatar: user.avatar });

    return user;
  }
}
