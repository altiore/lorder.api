import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken() {
    const user: JwtPayload = { identifier: 'user@email.com' };
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 3600 });
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.findOneByIdentifier(payload.identifier);
  }
}
