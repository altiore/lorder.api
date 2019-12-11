import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'lodash';

import { Project, ProjectDto, ProjectRepository } from '../@orm/project';
import { ProjectPub, ProjectPubRepository } from '../@orm/project-pub';
import { TaskRepository } from '../@orm/task';
import { User } from '../@orm/user';
import { ACCESS_LEVEL, UserProject, UserProjectRepository } from '../@orm/user-project';
import { ProjectPaginationDto } from './@dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectPubRepository) private readonly projectPubRepo: ProjectPubRepository,
    @InjectRepository(UserProjectRepository)
    private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository
  ) {}

  public async findOne(id: number): Promise<Project> {
    try {
      return await this.projectRepo.findOneBySuperAdmin(id);
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async findOneByMember(projectId: number, user: User): Promise<Project> {
    try {
      // 1. check user access
      const access = await this.userProjectRepo.findOne({
        where: {
          member: { id: user.id },
          project: { id: projectId },
        },
      });
      if (!(get(access, 'accessLevel') >= ACCESS_LEVEL.WHITE)) {
        throw new ForbiddenException(
          'Пользователь не может просматритьва подробную информацию' +
            ' об этом проекте. Пожалуйста подайте заявку на получение доступа!'
        );
      }
      // 2. load project if has correct access to it
      const project = await this.projectRepo.findOneByProjectId(projectId);
      project.accessLevel = project.members.find(el => el.member.id === user.id);
      return project;
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }

  public async create(data: ProjectDto, user: User): Promise<Project> {
    const project = await this.projectRepo.createByUser(data, user);
    await this.userProjectRepo.addToProject(project, user, user, ACCESS_LEVEL.VIOLET);
    return project;
  }

  public async remove(id: number, force: boolean = false): Promise<number> {
    if (force) {
      await this.taskRepo.delete({ projectId: id });
    }
    await this.projectRepo.delete(id);
    return id;
  }

  public async findAllParticipantByUser(
    pagesDto: ProjectPaginationDto,
    user: User
  ): Promise<UserProject[]> {
    return await this.userProjectRepo.findAllOwnProjects(pagesDto, user);
  }

  public async findAllBySuperAdmin(pagesDto: ProjectPaginationDto): Promise<Project[]> {
    return this.projectRepo.findAllWithPagination(pagesDto);
  }

  public async findPublishedByUuid(uuid: string): Promise<ProjectPub> {
    return await this.projectPubRepo.findPublishedByUuid(uuid);
  }

  public async publish(project: Project): Promise<Project> {
    if (await this.projectPubRepo.findPublishedByProject(project)) {
      throw new NotAcceptableException('Этот проект уже опубликован!');
    }
    await this.projectPubRepo.publishNew(project);
    return project;
  }

  /**
   * TODO: logic must be more complicated because of can be huge amount of data
   */
  public async updateStatistic(project: Project): Promise<any> {
    let statistic = {};
    try {
      const projectWithMembers = await this.projectRepo.findOne({
        relations: ['members', 'pub'],
        where: { id: project.id },
      });
      const data: {
        [key in any]: { value: number; time: number }
      } = projectWithMembers.members.reduce((res, member: UserProject) => {
        res[member.member.id] = { time: 0, value: 0 };
        return res;
      }, {});
      const step = 2;
      let i = 0;
      let tasksPortion;
      do {
        tasksPortion = await this.taskRepo.find({
          relations: ['userWorks'],
          skip: step * i,
          take: step,
          where: { project },
        });
        if (!tasksPortion || !tasksPortion.length) {
          break;
        }
        tasksPortion.map(task => {
          task.userWorks.map(work => {
            if (work.finishAt) {
              if (data[work.userId]) {
                data[work.userId].time += work.finishAt.clone().diff(work.startAt.clone());
              }
            }
            if (work.value) {
              if (data[work.userId]) {
                data[work.userId].value += work.value;
              }
            }
          });
        });
        i++;
      } while (tasksPortion.length === step);

      statistic = {
        data,
        members: projectWithMembers.members.map(member => ({
          accessLevel: member.accessLevel,
          avatar: member.member.avatarUrl,
          email: member.member.email,
          id: member.member.id,
        })),
      };
      if (projectWithMembers.pub) {
        await this.projectPubRepo.update(
          { project: projectWithMembers },
          {
            statistic,
          }
        );
      }
    } catch (e) {
      throw e;
    }
    return statistic;
  }
}
