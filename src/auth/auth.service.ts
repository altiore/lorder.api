import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailDto, LoginUserDto, User, UserRepository } from '../@entities/user';
import { MailAcceptedDto } from '../mail/dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async sendMagicLink({ email }: EmailDto, hostWithProtocol: string): Promise<MailAcceptedDto> {
    let user = await this.userService.findUserByEmail(email);
    const resetLink = this.createToken({ email });
    if (!user) {
      user = await this.userService.create({ email, resetLink });
    } else {
      await this.userRepo.update({ id: user.id }, { resetLink });
    }
    return await this.mailService.sendMagicLink(user.email, `${hostWithProtocol}/start/${resetLink}`);
  }

  /**
   * Возвращает JWT ключ
   */
  public async activate(resetLink: string): Promise<string> {
    const user = await this.userRepo.findOneByResetLink(resetLink);
    jwt.verify(resetLink, process.env.JWT_SECRET);
    return this.createToken({ email: user.email });
  }

  public async login(data: LoginUserDto): Promise<string> {
    const user = await this.userService.login(data);
    return this.createToken({ email: user.email });
  }

  public createToken(userInfo: JwtPayload) {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: 3600 });
  }

  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findUserByEmail(payload.email);
  }

}
