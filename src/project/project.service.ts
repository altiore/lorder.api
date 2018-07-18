import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project, ProjectRepository, ProjectDto } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { EmailDto, User } from '../@orm/user';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public findAll(user: User): Promise<Project[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public async findOne(id: number, user: User): Promise<Project> {
    try {
      return await this.projectRepo.findOneByOwner(id, user);
    } catch (e) {
      throw new NotFoundException(
        'Вы пытаетесь пригласить пользователя в проект, который не существует,' +
          ' или вы не являетесь его администратором',
      );
    }
  }

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }

  public async update(project: Project, taskTypesIds: number[]): Promise<any> {
    const taskTypes = await this.taskTypeRepo.findByIds(taskTypesIds);
    if (taskTypes.length !== taskTypesIds.length) {
      throw new NotAcceptableException(
        'Недопустимый id taskType был передан.' +
          ' Пожалуйста, убедитесь, что все сущности были созданы предварительно',
      );
    }
    // const projectTaskTypes = this.projectTaskTypeRepo.createMultipleByProjectAndTaskTypes(project, taskTypes);
    try {
      return await this.projectTaskTypeRepo.createMultiple(project, taskTypes);
    } catch (e) {
      console.log(e);
      return 'error';
    }
    // return this.projectRepo.replaceTaskTypes(project, projectTaskTypes);
  }

  public async invite(project: Project, invite: EmailDto, hostWithProtocol: string): Promise<User> {
    const { link, resetLink } = await this.authService.createActivationLink(invite.email, hostWithProtocol);
    if (await this.userService.exists(invite.email)) {
      throw new NotAcceptableException('Такой пользователь уже есть в системе!');
    }
    const { user } = await this.userService.createUser({
      email: invite.email,
      resetLink,
    });
    await this.mailService.sendInvite({
      email: invite.email,
      link,
      project: project.title,
    });
    return user;
  }
}
