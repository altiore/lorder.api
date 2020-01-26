import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectRepository } from '@orm/project';
import { ProjectPubRepository } from '@orm/project-pub';
import { User, UserRepository } from '@orm/user';

import { StatisticsResponse } from './dto';

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectPubRepository) private readonly projectPubRepo: ProjectPubRepository
  ) {}

  public async progress(): Promise<StatisticsResponse> {
    const projectsCount = await this.projectRepo.count();
    const activeUsersCount = await this.userRepo.count({ where: { status: User.ACTIVATED } });
    const publicProjectsCount = await this.projectPubRepo.count({ where: { isOpen: true } });
    const activity = randomInteger(29, 41) / 100;
    return {
      activeProjectsCount: projectsCount - activeUsersCount,
      activeUsersCount,
      activity,
      publicProjectsCount,
    };
  }
}
