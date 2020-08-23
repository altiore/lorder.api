import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './role.entity';
import { User } from './user.entity';

@Index(['roleId', 'userId'], { unique: true })
@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  roleId: number;

  @ManyToOne(() => Role, {
    eager: true,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  role: Role;
}
