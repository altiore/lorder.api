import { Get, Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { Roles } from '../@common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  root(): string {
    return this.usersService.root();
  }

  @Get(':id')
  @Roles('owner', 'admin')
  findOne(@Param('id', ParseIntPipe) id: number): string {
    return typeof id;
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    console.log('body', data);
  }
}
