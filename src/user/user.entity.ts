import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string;

  @Column({type: 'int', default: 1})
  status: number;

  @Column('int')
  paymentMethod: number;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  updatedAt: Date;
}
