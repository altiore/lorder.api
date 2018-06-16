import { Get, Controller, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
// import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { UserService } from './user.service';
import { User, CreateUserDto } from '../@entities/user';
import { InviteDto } from '../@entities/user/dto';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('super-admin')
  @ApiResponse({ status: 200, type: User, isArray: true })
  public all(): Promise<any> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiResponse({ status: 200, type: User })
  public findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiResponse({ status: 201, description: 'The User has been successfully created.', type: User })
  public create(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }

  @Post('invite')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiResponse({ status: 201, description: 'The Invite has been successfully sent.', type: User })
  public invite(@Body() data: InviteDto): Promise<User> {
    return this.usersService.invite(data);
  }
}
