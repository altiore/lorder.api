import { Body, Controller, Get, Patch, Query, Post, Req, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { User } from '../@entities/user';
import { EmailDto, LoginUserDto } from '../@entities/user/dto';
import { AuthService } from './auth.service';
import { MailAcceptedDto } from '../mail/dto';

@ApiBearerAuth()
@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic')
  @HttpCode(202)
  @ApiResponse({ status: 202, type: MailAcceptedDto })
  public magic(@Body() data: EmailDto, @Req() req: Request): Promise<MailAcceptedDto> {
    return this.authService.sendMagicLink(data, req.protocol + '://' + req.get('host'));
  }

  @Get('activate')
  @ApiResponse({ status: 200, description: 'Возвращает Bearer ключ' })
  public activate(@Query('identifier') identifier: string): Promise<string> {
    return this.authService.activate(identifier);
  }

  @Patch('login')
  @ApiResponse({ status: 200, type: User })
  public login(@Body() data: LoginUserDto): Promise<string> {
    return this.authService.login(data);
  }
}
