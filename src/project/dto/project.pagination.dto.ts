import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Project } from '../../@orm/project';

export class ProjectPaginationDto extends PaginationDto<Project> {}
