import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  menuItemId: number;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  qty: number;
}
