import { SetMetadata } from '@nestjs/common';

import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

export const AccessLevel = (level: ACCESS_LEVEL) => SetMetadata('accessLevel', level);
