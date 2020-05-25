import {
  HttpException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { DeepPartial } from 'typeorm';

import { EmailDto, LoginUserDto, RefreshUserDto, User, UserRepository } from '@orm/user';
import { UserProjectRepository } from '@orm/user-project';

import { ValidationException } from '../@common/exceptions/validation.exception';
import { Session } from '../@orm/session/session.entity';
import { RegisterUserDto } from '../@orm/user/dto/register.user.dto';
import { MailAcceptedDto } from '../mail/dto';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { SessionsService } from '../sessions/sessions.service';
import { UserService } from '../user/user.service';

import { ActivateDto, IdentityDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly sessionService: SessionsService
  ) {}

  public async sendMagicLink(
    data: EmailDto,
    hostWithProtocol: string,
    query?: string,
    returnUser: boolean = false
  ): Promise<User | MailAcceptedDto> {
    const email = data.email;
    let user = await this.userService.findUserByEmail(email);
    const link = await this.createMagicLink(data, hostWithProtocol, query);
    if (!user) {
      const res = await this.userService.createUser({ email });
      user = res.user;
    }
    const sendMagicLinkResult = await this.mailService.sendMagicLink(user.email, link);
    if (returnUser) {
      return user;
    }
    return sendMagicLinkResult;
  }

  public async activate(activateDto: ActivateDto, req: Request): Promise<IdentityDto> {
    let userData;
    try {
      userData = await this.redisService.findUserDataByOneTimeToken(activateDto.oneTimeToken);
    } catch (e) {
      throw new NotFoundException(
        'Истек срок действия одноразовой ссылки.' + ' Пожалуйста, запросите новую ссылку для восстановления'
      );
    }
    if (!userData || !userData.email) {
      throw new NotFoundException(
        'Истек срок действия одноразовой ссылки.' + ' Пожалуйста, запросите новую ссылку для восстановления'
      );
    }
    const user = await this.userService.findUserByEmail(userData.email);
    if (!user) {
      throw new NotFoundException('Пользователь был удален из системы. Пожалуйста повторите вход');
    }
    const dataForUpdate = {
      status: 10,
    } as DeepPartial<User>;
    if (userData.password) {
      dataForUpdate.password = userData.password;
    }
    await this.userService.unsafeUpdate(user, dataForUpdate);
    if (activateDto.project) {
      await this.userProjectRepo.activateInProject(user, { id: parseInt(activateDto.project, 0) });
    }

    const session = await this.sessionService.startSession(user, activateDto.device, req);
    return {
      ...user.profileData,
      refreshToken: session.refreshToken,
      ...this.createBearerKey({ uid: user.id }),
    };
  }

  public async login(data: LoginUserDto, hostWithProtocol: string, req: Request): Promise<IdentityDto> {
    const user = await this.userService.findUserByEmail(data.email, true);
    const exception = this.findException(user, data);

    if (exception) {
      if (user && !user.password) {
        const link = await this.createMagicLink(
          {
            email: data.email,
            password: this.userRepo.hashPassword(data.password),
          },
          hostWithProtocol
        );
        await this.mailService.sendMagicLink(data.email, link);
      }

      throw exception;
    }

    const session = await this.sessionService.startSession(user, data.device, req);
    return {
      ...user.profileData,
      refreshToken: session.refreshToken,
      ...this.createBearerKey({ uid: user.id }),
    };
  }

  public async refresh(data: RefreshUserDto, req: Request, user: User): Promise<IdentityDto> {
    let session: Session = null;
    try {
      session = await this.sessionService.findUserByRefresh(data, user, req);
    } catch (e) {
      throw new UnauthorizedException();
    }

    if (!session || !session.user || session.userId !== user.id) {
      throw new UnauthorizedException();
    }

    return {
      ...session.user.profileData,
      refreshToken: session.refreshToken,
      ...this.createBearerKey({ uid: session.userId }),
    };
  }

  public async registration(data: RegisterUserDto, hostWithProtocol: string): Promise<MailAcceptedDto> {
    const existingUser = await this.userService.findUserByEmail(data.email, true);

    if (existingUser) {
      throw new ValidationException([
        Object.assign(new ValidationError(), {
          constraints: {
            isExists: 'Пользователь с таким email-ом уже существует',
          },
          property: 'email',
          value: data.email,
        }),
      ]);
    }

    await this.userService.createUser({ email: data.email });
    const link = await this.createMagicLink(
      {
        email: data.email,
        password: this.userRepo.hashPassword(data.password),
      },
      hostWithProtocol
    );
    return await this.mailService.sendMagicLink(data.email, link);
  }

  /**
   * Используется для валидации JWT ключа при каждом получении запроса с ключем
   */
  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findActiveUserByEmail(payload);
  }

  /**
   * Используется при создании ключа валидации
   */
  public createBearerKey(userInfo: JwtPayload): { bearerKey: string; expiresIn: number } {
    const configExpiresIn = parseInt(process.env.JWT_EXPIRES_IN, 0) || 3600;
    const expiresIn = moment()
      .add(configExpiresIn, 'second')
      .unix();
    return {
      bearerKey: jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: configExpiresIn }),
      expiresIn,
    };
  }

  private async createMagicLink(userData: LoginUserDto | EmailDto, host: string, query: string = ''): Promise<string> {
    const resetLinkToken = await this.redisService.createOneTimeToken(userData);
    return `${host}/start/${resetLinkToken}${query ? `?${query}` : ''}`;
  }

  private findException(user: User, data: LoginUserDto): HttpException {
    if (!user) {
      return new ValidationException(
        [
          Object.assign(new ValidationError(), {
            constraints: {
              isNotFound: 'Email не был найден',
            },
            property: 'email',
            value: data.email,
          }),
        ],
        'Поьзователь не был найден'
      );
    }
    if (!user.password) {
      return new NotAcceptableException(
        'Пароль пользователя никогда ранее не был задан.' +
          ' Мы отправили ссылку для активации нового пароля. Пожалуйста, проверьте почту'
      );
    }
    if (!this.userRepo.isStatusActive(user)) {
      return new NotAcceptableException(
        'Email пользовтаеля еще не подтвержден.' +
          ' Мы отправили ссылку для активации пользователя. Пожалуйста, проверьте почту'
      );
    }
    if (!this.userRepo.isPasswordValid(user, data.password)) {
      return new ValidationException(
        [
          Object.assign(new ValidationError(), {
            constraints: {
              isNotFound: 'Пароль неверен',
            },
            property: 'password',
            value: data.email,
          }),
        ],
        'Мы выслали вам ссылку для восстановления пароля. Пожалуйста, проверьте почту, чтоб зайти'
      );
    }
    return null;
  }
}
