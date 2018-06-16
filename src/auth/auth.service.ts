import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailDto, LoginUserDto, User } from '../@entities/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async sendMagicLink({ email }: EmailDto) {
    const user = await this.userService.findUserByEmail(email);
    this.mailService.sendInvite(user);
  }

  public async login(data: LoginUserDto): Promise<string> {
    const user = await this.userService.login(data);
    return this.createToken({ username: user.username });
  }

  public createToken(userInfo: JwtPayload) {
    return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: 3600 });
  }

  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findOneByUsername(payload.username);
  }
}
