import { EntityRepository, Repository } from 'typeorm';

import { CLOUD_TYPE, Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public findByUrl(url: string) {
    return this.findOneOrFail({ url });
  }

  public async createOne(data: Partial<Media>): Promise<Media> {
    const media = this.create(data);
    return await this.save(media);
  }

  public async updateUrl(media: Media, url: string, type?: CLOUD_TYPE): Promise<Media> {
    media.url = url;
    if (type) {
      media.cloud = type;
    }
    return this.save(media);
  }
}
