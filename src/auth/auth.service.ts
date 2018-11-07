import { HttpException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import { DeepPartial } from 'typeorm';

import { ValidationException } from '../@common/exceptions/validation.exception';
import { EmailDto, LoginUserDto, User, UserRepository } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { MailAcceptedDto } from '../mail/dto';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
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
    private readonly userService: UserService
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

  public async activate(activateDto: ActivateDto): Promise<IdentityDto> {
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
    return {
      ...user.publicData,
      bearerKey: this.createBearerKey({ email: user.email }),
    };
  }

  public async login(data: LoginUserDto, hostWithProtocol: string): Promise<IdentityDto> {
    const user = await this.userService.findUserByEmail(data.email, true);
    const exception = this.findException(user, data);
    if (exception) {
      if (!user) {
        await this.userService.createUser({ email: data.email });
      }
      const link = await this.createMagicLink(
        {
          email: data.email,
          password: this.userRepo.hashPassword(data.password),
        },
        hostWithProtocol
      );
      await this.mailService.sendMagicLink(data.email, link);
      throw exception;
    }

    return {
      ...user.publicData,
      bearerKey: this.createBearerKey({ email: user.email }),
    };
  }

  /**
   * Используется для валидации JWT ключа при каждом получении запроса с ключем
   */
  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findActiveUserByEmail(payload.email);
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
        'Поьзователь не был найдет. Мы успешно создали нового пользователя и отправили ссылку для активации'
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

  /**
   * Используется при создании ключа валидации
   */
  private createBearerKey(userInfo: JwtPayload): string {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 0) || 3600 });
  }
}
