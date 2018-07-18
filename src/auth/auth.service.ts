import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './interfaces';
import { TokenResponseDto } from './dto';
import { EmailDto, LoginUserDto, User } from '../@orm/user';
import { MailAcceptedDto } from '../mail/dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly mailService: MailService) {}

  public async sendMagicLink({ email }: EmailDto, hostWithProtocol: string): Promise<MailAcceptedDto> {
    let user = await this.userService.findUserByEmail(email);
    const { link, resetLink } = this.createActivationLink(email, hostWithProtocol);
    if (!user) {
      const res = await this.userService.createUser({ email, resetLink });
      user = res.user;
    } else {
      await this.userService.update(user, { resetLink });
    }
    return await this.mailService.sendMagicLink(user.email, link);
  }

  public async activate(resetLink: string): Promise<TokenResponseDto> {
    const user = await this.userService.activateByResetLink(resetLink);
    jwt.verify(resetLink, process.env.JWT_SECRET);
    return this.createToken({ email: user.email });
  }

  public async login(data: LoginUserDto): Promise<TokenResponseDto> {
    const user = await this.userService.login(data);
    return this.createToken({ email: user.email });
  }

  /**
   * Используется для валидации JWT ключа при каждом получении запроса с ключем
   */
  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findActiveUserByEmail(payload.email);
  }

  public createActivationLink(email, hostWithProtocol): { resetLink: string; link: string } {
    const { token: resetLink } = this.createToken({ email });
    return { resetLink, link: `${hostWithProtocol}/start/${resetLink}` };
  }

  /**
   * Используется при создании ключа валидации
   */
  private createToken(userInfo: JwtPayload): TokenResponseDto {
    return { token: jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: 3600 }) };
  }
}
