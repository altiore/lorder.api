import { Get, Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '../@common/guards/auth.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@ApiBearerAuth()
@ApiUseTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, type: User, isArray: true })
  public async root(): Promise<any> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('owner', 'admin')
  @ApiResponse({ status: 200, type: User })
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'The User has been successfully created.', type: User })
  public async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }
}
