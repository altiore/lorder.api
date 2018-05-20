import { Get, Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';

import { Roles } from '../@common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async root(): Promise<any> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('owner', 'admin')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Post()
  public async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }
}
