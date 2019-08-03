import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiImplicitFile, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Roles } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { MyFileInterceptor } from '../@common/interceptors';
import { Media } from '../@orm/media';
import { FileService } from './file.service';

@ApiBearerAuth()
@ApiUseTags('file (role: user)')
@Controller('file')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FileController {
  constructor(private readonly taskService: FileService) {}

  @Roles('user')
  @ApiResponse({ status: 200, type: Media })
  @ApiImplicitFile({ name: 'file', required: true, description: 'Media File' })
  @Post('upload')
  @UseInterceptors(MyFileInterceptor)
  public uploadFile(@UploadedFile() file) {
    return this.taskService.saveToGoogleCloudStorage(file);
  }
}
