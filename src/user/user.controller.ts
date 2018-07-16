import { Get, Controller, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserService } from './user.service';
import { User, CreateUserDto } from '../@orm/user';

@ApiBearerAuth()
@ApiUseTags('users (super-admin)')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles('super-admin')
  @ApiResponse({ status: 200, type: User, isArray: true })
  public all(): Promise<any> {
    // TODO: pagination
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('super-admin')
  @ApiResponse({ status: 200, type: User })
  public findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles('super-admin')
  @ApiResponse({ status: 200 })
  public remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.remove(id);
  }

  @Post('invite')
  @Roles('super-admin')
  @ApiResponse({
    status: 201,
    description: 'The Invite has been successfully sent.',
    type: User,
  })
  public invite(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.invite(data);
  }
}
