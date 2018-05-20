import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  root(): string {
    return 'Hello Users!';
  }
}
