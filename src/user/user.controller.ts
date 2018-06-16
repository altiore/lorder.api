import { Get, Controller, Patch, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { UserService } from './user.service';
import { User, CreateUserDto, UpdateUserDto } from '../@entities/user';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { InviteDto, LoginUserDto } from '../@entities/user/dto';
import { AuthService } from '../auth/auth.service';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Patch('login')
  @ApiResponse({ status: 200, type: User })
  public async login(@Body() data: LoginUserDto): Promise<string> {
    const user = await this.usersService.login(data);
    return this.authService.createToken({ username: user.username });
  }

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

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @ApiResponse({ status: 200, description: 'The User has been successfully updated.', type: User })
  public update(@UserJWT() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.usersService.update(user, data);
  }

  @Post('invite')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiResponse({ status: 201, description: 'The Invite has been successfully sent.', type: User })
  public invite(@Body() data: InviteDto): Promise<User> {
    return this.usersService.invite(data);
  }
}
