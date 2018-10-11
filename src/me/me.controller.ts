import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Roles } from '@common/decorators/roles.decorator';
import { UserJWT } from '@common/decorators/user-jwt.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { UpdateUserDto, User } from '@orm/user';
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
