import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { get } from 'lodash';
import { Repository } from 'typeorm';

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
    if (session) {
      await this.repo.update({ id: session.id }, { headers: req.headers });
      return session;
    }

    const maxRes = await this.repo.query(
      `SELECT MAX("deviceNumber") + 1 as "deviceNumber" FROM "session" WHERE "userId"=${user.id}`
    );
    const deviceNumber = get(maxRes, [0, 'deviceNumber'], 1) || 1;
    const refreshToken = this.createRefreshToken({ uid: user.id });
    const model = this.repo.create({
      ...this.getSession(device, req),
      device,
      deviceNumber,
      refreshToken,
      userId: user.id,
    });
    return this.repo.save(model);
  }

  public async findUserByRefresh(data: RefreshUserDto, user, req: Request): Promise<Session> {
    const session = await this.repo.findOne({
      relations: this.relations,
      where: {
        refreshToken: data.refreshToken,
        ...this.getFindOptions(req),
      },
    });
    try {
      this.validateToken(session.refreshToken, user);
    } catch (e) {
      Logger.log(e);
    }
    await this.repo.update(
      { id: session.id },
      {
        headers: req.headers,
      }
    );
    return session;
  }

  public createRefreshToken(userInfo: JwtPayload): string {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '7 days' });
  }

  public validateToken(token: string, user: User): void {
    jwt.verify(token, process.env.JWT_SECRET);
    const userData = jwt.decode(token) as JwtPayload;
    if (userData.uid !== user.id) {
      throw new Error('Invalid token owner');
    }
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
      referer: req.header('referer') || 'no referer',
      userAgent: req.header('user-agent') || 'no user-agent',
    };
  }

  private getSession(device: string, req: Request): Partial<Session> {
    return {
      acceptLanguage: req.header('accept-language') || 'en',
      device,
      headers: req.headers,
      referer: req.header('referer') || 'no referer',
      userAgent: req.header('user-agent') || 'no user-agent',
    };
  }

  private get relations() {
    return ['user', ...requiredUserRelations.map(el => `user.` + el)];
  }
}
