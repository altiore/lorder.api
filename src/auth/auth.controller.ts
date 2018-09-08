import { Body, Controller, Get, Headers, HttpCode, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { User } from '../@orm/user';
import { EmailDto, LoginUserDto } from '../@orm/user/dto';
import { MailAcceptedDto } from '../mail/dto';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto';

@ApiBearerAuth()
@ApiUseTags('auth (guest)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 202, type: MailAcceptedDto })
  @HttpCode(202)
  @Post('magic')
  public magic(@Body() data: EmailDto, @Headers('origin') origin: string): Promise<MailAcceptedDto> {
    return this.authService.sendMagicLink(data, origin);
  }

  @ApiResponse({ status: 200, description: 'Возвращает Bearer ключ', type: TokenResponseDto })
  @Get('activate')
  public activate(@Query('oneTimeToken') oneTimeToken: string): Promise<TokenResponseDto> {
    return this.authService.activate(oneTimeToken);
  }

  @ApiResponse({ status: 200, type: MailAcceptedDto })
  @ApiResponse({ status: 200, type: User })
  @Patch('login')
  public async login(
    @Body() data: LoginUserDto,
    @Headers('origin') origin: string
  ): Promise<TokenResponseDto | MailAcceptedDto> {
    return this.authService.login(data, origin);
  }
}
