import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Roles, UserJWT } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { UpdateUserDto, User } from '../@orm/user';
import { MeService } from './me.service';

@ApiBearerAuth()
@ApiUseTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @ApiResponse({
    description: 'The User has been successfully updated.',
    status: 200,
    type: User,
  })
  public update(@UserJWT() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.meService.update(user, data);
  }
}
