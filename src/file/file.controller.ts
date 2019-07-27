import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Roles } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { FileService } from './file.service';

@ApiBearerAuth()
@ApiUseTags('file (role: user)')
@Controller('file')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FileController {
  constructor(private readonly taskService: FileService) {}

  @Roles('user')
  @ApiResponse({ status: 200, type: String })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          // Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  public uploadFile(@UploadedFile() file) {
    return this.taskService.saveToGoogleCloudStorage(file);
  }
}
