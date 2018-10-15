import { createParamDecorator } from '@nestjs/common';

export const ProjectParam = createParamDecorator((data, res) => res.project);
