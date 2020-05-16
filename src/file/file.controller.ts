import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Media } from '@orm/media';

import { Roles } from '../@common/decorators';
import { FileUploadDto } from '../@common/dto';
import { RolesGuard } from '../@common/guards';
import { MyFileInterceptor } from '../@common/interceptors';

import { FileService } from './file.service';

@ApiBearerAuth()
@ApiTags('file (role: user)')
@Controller('file')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Roles('user')
  @ApiResponse({ status: 200, type: Media })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar File',
    type: FileUploadDto,
  })
  @Post('upload')
  @UseInterceptors(MyFileInterceptor)
  public uploadFile(@UploadedFile() file) {
    return this.fileService.saveToGoogleCloudStorage(file);
  }
}
