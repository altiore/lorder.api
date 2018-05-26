import { Get, Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
// import { pick } from 'lodash';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { UserService } from './user.service';
import { User, CreateUserDto } from '../@entities/user';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiBearerAuth()
@ApiUseTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('self')
  @ApiResponse({ status: 200, type: User })
  public async self(@UserJWT() user: User): Promise<any> {
    // const payload: JwtPayload = pick(user, ['identifier']);
    const payload: JwtPayload = { identifier: 'user@email.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    return { user, token };
  }

  @Get()
  @ApiResponse({ status: 200, type: User, isArray: true })
  public async all(): Promise<any> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
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
