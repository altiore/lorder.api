import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

// import { RolesGuard } from '../@common/guards/roles.guard';
// import { Roles } from '../@common/decorators/roles.decorator';
import { User } from '../@entities/user';
import { EmailDto, LoginUserDto } from '../@entities/user/dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('magic')
  @ApiResponse({ status: 200, type: User })
  public async magic(@Body() data: EmailDto): Promise<string> {
    return this.authService.sendMagicLink(data);
  }

  @Patch('login')
  @ApiResponse({ status: 200, type: User })
  public async login(@Body() data: LoginUserDto): Promise<string> {
    return this.authService.login(data);
  }
}
