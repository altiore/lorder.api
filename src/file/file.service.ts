import { Storage, UploadResponse } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

import { Media, MEDIA_TYPE, MediaRepository } from '../@orm/media';

const BASE_GOOGLE_URL = 'storage.googleapis.com';

const removeFile = fileName => {
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, function(err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

@Injectable()
export class FileService {
  constructor(@InjectRepository(MediaRepository) private readonly mediaRepo: MediaRepository) {}

  public async saveToGoogleCloudStorage(file: any): Promise<Media> {
    const storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    const res = await storage.bucket(process.env.GOOGLE_APPLICATION_BUCKET).upload(file.path, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
    });

    try {
      await removeFile(file.path);
    } catch (err) {
      throw new InternalServerErrorException('Could not remove temporary created file');
    }

    return await this.mediaRepo.createOne({
      type: MEDIA_TYPE.IMAGE,
      url: this.getMediaUrl(res),
    });
  }

  private getMediaUrl(uploadResponse: UploadResponse) {
    return ['https:/', `${uploadResponse[0].metadata.bucket}.${BASE_GOOGLE_URL}`, uploadResponse[0].metadata.name].join(
      '/'
    );
  }
}
