import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';
import { User } from '../@orm/user';
import { UserDto, UserPaginationDto } from './dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiUseTags('users (super-admin)')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiResponse({ status: 200, type: User, isArray: true })
  @Get()
  @Roles('super-admin')
  public all(@Query() pagesDto: UserPaginationDto): Promise<User[]> {
    return this.usersService.findAll(pagesDto);
  }

  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  @Roles('super-admin')
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiResponse({ status: 200 })
  @Patch(':id')
  @Roles('super-admin')
  public update(@Body() data: UserDto, @Param('id', ParseIntPipe) id: number, @UserJWT() user: User): Promise<User> {
    if (id === user.id) {
      throw new NotAcceptableException('Вы не можете изменить свои данные. Используйте профайл для этого');
    }
    return this.usersService.updateUserById(id, data);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  @Roles('super-admin')
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
