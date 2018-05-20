import { Get, Controller, Post, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  root(): string {
    return this.usersService.root();
  }

  @Post()
  create(@Body() data: CreateUserDto) {

  }
}
