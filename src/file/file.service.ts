import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Storage, UploadResponse } from '@google-cloud/storage';
import { get } from 'lodash';

import { CLOUD_TYPE, Media, MEDIA_TYPE } from '@orm/entities/media.entity';
import { MediaRepository } from '@orm/media/media.repository';

import * as fs from 'fs';

import { parseGoogleObjName } from '../@common/helpers/parseGoogleObjName';

const BASE_GOOGLE_URL = 'storage.googleapis.com';

const removeFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.unlink(fileName, function (err) {
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

  public async saveToGoogleCloudStorage(file: any, media?: Media): Promise<Media> {
    const storage = new Storage();

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

    if (media && media.url) {
      return this.mediaRepo.updateUrl(media, this.getMediaUrl(res), CLOUD_TYPE.GOOGLE);
    }

    return await this.mediaRepo.createOne({
      cloud: CLOUD_TYPE.GOOGLE,
      type: MEDIA_TYPE.IMAGE,
      url: this.getMediaUrl(res),
    });
  }

  public async updateOrCreateObjInGoogleCloudStorage(file: any, media: Media): Promise<Media> {
    // 1. check that media is from google cloud storage
    if (get(media, 'cloud') === CLOUD_TYPE.GOOGLE) {
      const storage = new Storage();

      // 2. Если файл был ранее сохранен в GOOGLE CLOUD - удалить файл и сохранить новый
      const fileName = this.getObjectName(media);
      await storage.bucket(process.env.GOOGLE_APPLICATION_BUCKET).file(fileName).delete();

      const res = await storage.bucket(process.env.GOOGLE_APPLICATION_BUCKET).upload(file.path, {
        gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });

      return this.mediaRepo.updateUrl(media, this.getMediaUrl(res), CLOUD_TYPE.GOOGLE);
    }

    return this.saveToGoogleCloudStorage(file, media);
  }

  public async createOne(data: Partial<Media>): Promise<Media> {
    return await this.mediaRepo.createOne(data);
  }

  private getMediaUrl(uploadResponse: UploadResponse) {
    return ['https:/', `${uploadResponse[0].metadata.bucket}.${BASE_GOOGLE_URL}`, uploadResponse[0].metadata.name].join(
      '/'
    );
  }

  private getObjectName(media: Media): string {
    return parseGoogleObjName(media.url);
  }
}
