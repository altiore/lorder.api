import { Body, Controller, Get, Headers, HttpCode, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { User } from '../@orm/user';
import { EmailDto, LoginUserDto } from '../@orm/user/dto';
import { MailAcceptedDto } from '../mail/dto';
import { AuthService } from './auth.service';
import { ActivateDto, TokenResponseDto } from './dto';

@ApiBearerAuth()
@ApiUseTags('auth (guest)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 202, type: MailAcceptedDto })
  @HttpCode(202)
  @Post('magic')
  public async magic(@Body() data: EmailDto, @Headers('origin') origin: string): Promise<MailAcceptedDto> {
    return (await this.authService.sendMagicLink(data, origin)) as MailAcceptedDto;
  }

  @ApiResponse({ status: 200, description: 'Возвращает Bearer ключ', type: TokenResponseDto })
  @Get('activate')
  public activate(@Query() activateDto: ActivateDto): Promise<TokenResponseDto> {
    return this.authService.activate(activateDto);
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
