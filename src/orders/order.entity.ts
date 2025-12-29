import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../users/user.entity';

export type OrderStatus = 'NEW' | 'DONE';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, (r) => r.orders, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @Column({ type: 'varchar', length: 10, default: 'NEW' })
  status: OrderStatus;

  // номер стола
  @Column({ type: 'varchar', length: 20 })
  tableNumber: string;

  @Column({ type: 'int' })
  total: number;

  @ManyToOne(() => User, (u) => u.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  createdBy: User | null;

  @Column({ type: 'int', nullable: true })
  createdById: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true })
  items: OrderItem[];
}
