import { EntityRepository, In, Repository } from 'typeorm';

import { Media } from './media.entity';

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
  public findByUrl(url: string) {
    return this.findOneOrFail({ url });
  }
}
