import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotAcceptableException,
  Patch,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { EmailDto, LoginUserDto, RefreshUserDto } from '@orm/user/dto';

import { ValidationException } from '@common/exceptions/validation.exception';

import { Request as Req, Response as Res } from 'express';

import { RegisterUserDto } from '../@orm/user/dto/register.user.dto';
import { MailAcceptedDto } from '../mail/dto';
import { AuthService } from './auth.service';
import { ActivateDto, IdentityDto } from './dto';

@ApiTags('auth (guest)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 202, type: MailAcceptedDto })
  @HttpCode(202)
  @Post('magic')
  public async magic(@Body() data: EmailDto, @Headers('origin') origin: string): Promise<MailAcceptedDto> {
    await this.authService.checkGoogleReCaptcha(data.reCaptcha);
    return (await this.authService.sendMagicLink(data, origin)) as MailAcceptedDto;
  }

  @ApiResponse({ status: 200, type: IdentityDto })
  @ApiResponse({
    status: 406,
    type: NotAcceptableException,
    description: 'A link to activate the password has been sent',
  })
  @ApiResponse({ status: 422, type: ValidationException })
  @Patch('login')
  public async login(
    @Body() data: LoginUserDto,
    @Headers('origin') origin: string,
    @Request() req: Req
  ): Promise<IdentityDto> {
    await this.authService.checkGoogleReCaptcha(data.reCaptcha);
    return await this.authService.login(data, origin, req);
  }

  @ApiResponse({ status: 202, type: MailAcceptedDto })
  @ApiResponse({ status: 422, type: ValidationException })
  @Post('register')
  public async register(
    @Body() data: RegisterUserDto,
    @Headers('origin') origin: string,
    @Request() req: Req,
    @Response() response: Res
  ): Promise<MailAcceptedDto> {
    await this.authService.checkGoogleReCaptcha(data.reCaptcha);
    return response.status(202).send(await this.authService.registration(data, origin));
  }

  @ApiResponse({ status: 200, description: 'Возвращает Bearer ключ', type: IdentityDto })
  @Get('activate')
  public activate(@Query() activateDto: ActivateDto, @Request() req: Req): Promise<IdentityDto> {
    return this.authService.activate(activateDto, req);
  }

  @ApiResponse({ status: 200, type: IdentityDto })
  @ApiResponse({ status: 422, type: ValidationException })
  @Patch('refresh')
  public async refresh(@Body() data: RefreshUserDto, @Request() req: Req): Promise<IdentityDto> {
    return await this.authService.refresh(data, req);
  }

  @ApiResponse({ status: 200, type: MailAcceptedDto })
  @Patch('update-password')
  public async updatePassword(
    @Body() data: LoginUserDto,
    @Headers('origin') origin: string,
    @Request() req: Req
  ): Promise<MailAcceptedDto> {
    await this.authService.checkGoogleReCaptcha(data.reCaptcha);
    return await this.authService.updatePassword(data, origin, req);
  }
}
