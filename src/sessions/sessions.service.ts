import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import * as jwt from 'jsonwebtoken';
import { isEqual, pick } from 'lodash';
import { Repository } from 'typeorm';

import { Request } from 'express';

import getReferer from '../@common/helpers/getReferer';
import { Session } from '../@orm/session/session.entity';
import { RefreshUserDto, User } from '../@orm/user';
import { requiredUserRelations } from '../@orm/user/dto/required.relations';
import { JwtPayload } from '../auth/interfaces';

@Injectable()
export class SessionsService extends TypeOrmCrudService<Session> {
  constructor(@InjectRepository(Session) repo: Repository<Session>) {
    super(repo);
  }

  public async startSession(user: User, device: string, req: Request): Promise<Session> {
    const session = await this.findByDevice(user.id, device);
    const refreshToken = this.createRefreshToken({ uid: user.id });

    if (session) {
      const updated = {
        ...this.getSession(device, req),
        refreshToken,
      };
      await this.repo.update({ id: session.id }, updated);
      return this.repo.merge(session, updated);
    }

    const model = this.repo.create({
      ...this.getSession(device, req),
      refreshToken,
      userId: user.id,
    });
    return this.repo.save(model);
  }

  public async refreshSession(data: RefreshUserDto, req: Request): Promise<Session> {
    const session = await this.repo.findOne({
      relations: this.relations,
      where: {
        refreshToken: data.refreshToken,
      },
    });
    if (!session) {
      throw new NotAcceptableException('Session was not found');
    }
    try {
      if (this.validateSession(session, req)) {
        const updateFields = {
          ...this.getSession(session.device, req),
          refreshToken: this.createRefreshToken({ uid: session.userId }),
        };
        await this.repo.update({ id: session.id }, updateFields);
        return this.repo.merge(session, updateFields);
      }
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  public createRefreshToken(userInfo: JwtPayload): string {
    return jwt.sign(userInfo, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN });
  }

  public validateToken(token: string): boolean {
    return Boolean(jwt.verify(token, process.env.REFRESH_SECRET));
  }

  public validateSession(session: Session, req): boolean {
    const sessionInfoFromReq = this.getFindOptions(req);
    const sessionInfo = pick(session, Object.keys(sessionInfoFromReq));
    return isEqual(sessionInfoFromReq, sessionInfo) && this.validateToken(session.refreshToken);
  }

  private findByDevice(userId: number, device: string) {
    return this.repo.findOne({
      relations: this.relations,
      where: {
        device,
        userId,
      },
    });
  }

  private getFindOptions(req: Request): Partial<Session> {
    return {
      acceptLanguage: req.header('accept-language') || 'en',
      referer: getReferer(req.header('referer')) || 'no referer',
      userAgent: req.header('user-agent') || 'no user-agent',
    };
  }

  private getSession(device: string, req: Request): Partial<Session> {
    return {
      acceptLanguage: req.header('accept-language') || 'en',
      device,
      headers: req.headers,
      referer: getReferer(req.header('referer')) || 'no referer',
      userAgent: req.header('user-agent') || 'no user-agent',
    };
  }

  private get relations() {
    return ['user', ...requiredUserRelations.map(el => `user.` + el)];
  }
}
