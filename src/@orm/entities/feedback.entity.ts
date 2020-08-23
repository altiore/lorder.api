import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Feedback {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  userId: number;

  @ApiPropertyOptional({ type: User })
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ApiProperty()
  @Column({ nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  feedback: string;
}
