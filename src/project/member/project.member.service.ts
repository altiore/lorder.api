import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';

import { IdDto } from '../../@common/dto';
import { Project } from '../../@orm/project';
import { EmailDto, User, UserRepository } from '../../@orm/user';
import { UserProject, UserProjectRepository } from '../../@orm/user-project';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly authService: AuthService
  ) {}

  public async findMember(id: number, project: Project): Promise<UserProject> {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userProjectRepo.findOne({ member: user, project });
  }

  public async updateMember(memberId: number, project: Project, data: DeepPartial<UserProject>): Promise<UserProject> {
    const member = await this.findMember(memberId, project);
    if (!member) {
      throw new NotFoundException('Member not found in this project');
    }
    member.accessLevel = data.accessLevel;
    await this.userProjectRepo.update(
      { member: member.member, project },
      {
        accessLevel: data.accessLevel,
      }
    );
    return member;
  }

  public async invite(
    project: DeepPartial<Project>,
    invite: EmailDto,
    hostWithProtocol: string,
    inviter: User
  ): Promise<UserProject> {
    const query = `project=${project.id}`;
    const member = (await this.authService.sendMagicLink(invite, hostWithProtocol, query, true)) as User;
    return await this.userProjectRepo.addToProject(project, member, inviter);
  }

  public async removeMemberFromProject({ id }: IdDto, project: DeepPartial<Project>): Promise<boolean> {
    await this.userProjectRepo.delete({ member: { id }, project: { id: project.id } });
    return true;
  }

  public async acceptInvitation(user: User, project: DeepPartial<Project>): Promise<UserProject> {
    const userProject = await this.userProjectRepo.findOne({
      where: {
        member: user,
        project,
      },
    });
    if (!userProject) {
      throw new NotAcceptableException('Приглашение было отозвано');
    }
    return await this.userProjectRepo.activateInProject(user, project);
  }

  public getAllByProject(project: Project, user: User): Promise<UserProject[]> {
    return this.userProjectRepo.findWithStatistic(project);
  }
}
