import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from '../user';
import { WorkType } from '../work-type';

@Entity()
export class UserWorkType {
  @ManyToOne(() => User, { nullable: false, primary: true })
  user: User;

  @ManyToOne(() => WorkType, { nullable: false, primary: true })
  workType: WorkType;

  @Column()
  hourValue: number;
}
