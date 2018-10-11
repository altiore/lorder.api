import { ReflectMetadata } from '@nestjs/common';

import { ACCESS_LEVEL } from '@orm/user-project';

export const AccessLevel = (level: ACCESS_LEVEL) => ReflectMetadata('accessLevel', level);
