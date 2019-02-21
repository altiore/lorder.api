import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Feedback {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelPropertyOptional()
  @Column({ nullable: true })
  userId: number;

  @ApiModelPropertyOptional({ type: User })
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ApiModelProperty()
  @Column({ nullable: false })
  email: string;

  @ApiModelProperty()
  @Column({ nullable: false })
  name: string;

  @ApiModelProperty()
  @Column({ type: 'text', nullable: false })
  feedback: string;
}
