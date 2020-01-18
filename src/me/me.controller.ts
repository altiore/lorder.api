import { Body, Controller, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth, res, UserJWT } from '../@common/decorators';
import { ROLES } from '../@orm/role';
import { UpdateUserDto, User } from '../@orm/user';
import { MeService } from './me.service';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Patch()
  @Auth(res(User).updateOne, ROLES.USER)
  public update(@UserJWT() user: User, @Body() data: UpdateUserDto): Promise<User> {
    return this.meService.update(user, data);
  }
}
