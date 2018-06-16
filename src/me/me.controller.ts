import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { MeService } from './me.service';
import { User, UpdateUserDto } from '../@entities/user';

@ApiBearerAuth()
@ApiUseTags('me')
@Controller('me')
export class MeController {
  constructor(
    private readonly meService: MeService,
  ) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  @ApiResponse({ status: 200, description: 'The User has been successfully updated.', type: User })
  public update(@UserJWT() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.meService.update(user, data);
  }
}
