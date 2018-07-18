import { Get, Controller, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { User } from '../@orm/user';
import { UserService } from './user.service';

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
}
