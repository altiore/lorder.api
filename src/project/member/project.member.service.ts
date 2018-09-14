import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IdDto } from '../../@common/dto';
import { Project } from '../../@orm/project';
import { EmailDto, User } from '../../@orm/user';
import { UserProjectRepository } from '../../@orm/user-project';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    private readonly authService: AuthService
  ) {}

  public async invite(project: Project, invite: EmailDto, hostWithProtocol: string, inviter: User): Promise<User> {
    const query = `project=${project.id}`;
    const member = (await this.authService.sendMagicLink(invite, hostWithProtocol, query, true)) as User;
    await this.userProjectRepo.addToProject(project, member, inviter);
    return member;
  }

  public async removeMemberFromProject({ id }: IdDto, project: Project): Promise<boolean> {
    await this.userProjectRepo.delete({ member: { id }, project });
    return true;
  }
}
