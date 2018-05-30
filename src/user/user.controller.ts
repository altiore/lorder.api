import {
  Get,
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
// import { pick } from 'lodash';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { UserService } from './user.service';
import { User, CreateUserDto, UpdateUserDto } from '../@entities/user';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { InviteDto } from '../@entities/user/dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiUseTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('self')
  @ApiResponse({ status: 200, type: User })
  public async self(@UserJWT() user: User): Promise<any> {
    // const payload: JwtPayload = pick(user, ['identifier']);
    const payload: JwtPayload = { identifier: 'razvan' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return { user, token };
  }

  @Get()
  @ApiResponse({ status: 200, type: User, isArray: true })
  public all(): Promise<any> {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @Roles('owner', 'admin')
  @ApiResponse({ status: 200, type: User })
  public findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The User has been successfully created.',
    type: User,
  })
  public create(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'The User has been successfully updated.',
    type: User,
  })
  public update(
    @UserJWT() user: User,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(user, data);
  }

  @Post('invite')
  @ApiResponse({
    status: 201,
    description: 'The Invite has been successfully sent.',
    type: User,
  })
  public invite(@Body() data: InviteDto): Promise<User> {
    return this.usersService.invite(data);
  }
}
