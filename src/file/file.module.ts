import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaRepository } from '@orm/media/media.repository';

import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  exports: [FileService],
  imports: [TypeOrmModule.forFeature([MediaRepository])],
  providers: [FileService],
})
export class FileModule {}
