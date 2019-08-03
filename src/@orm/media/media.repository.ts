import { EntityRepository, In, Repository } from 'typeorm';

import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public findByUrl(url: string) {
    return this.findOneOrFail({ url });
  }

  public async createOne(data: Partial<Media>): Promise<Media> {
    const media = this.create(data);
    return await this.save(media);
  }

  public async updateUrl(media: Media, url: string): Promise<Media> {
    media.url = url;
    return this.save(media);
  }
}
