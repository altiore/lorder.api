import { PaginationDto } from '../../@common/dto/pagination.dto';
import { User } from '../../@orm/user';

export class UserPaginationDto extends PaginationDto<User> {}
