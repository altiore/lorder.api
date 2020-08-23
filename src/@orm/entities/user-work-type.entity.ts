import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { WorkType } from './work-type.entity';

@Entity()
export class UserWorkType {
  @ManyToOne(() => User, { nullable: false, primary: true })
  user: User;

  @ManyToOne(() => WorkType, { nullable: false, primary: true })
  workType: WorkType;

  @Column()
  hourValue: number;
}
