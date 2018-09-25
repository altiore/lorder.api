import { PaginationDto } from '../../@common/dto/pagination.dto';

export enum ProjectFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class ProjectPaginationDto extends PaginationDto<ProjectFieldsEnum> {}
