import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { MenuItem } from '../menu/menu-item.entity';
import { Order } from '../orders/order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'double', nullable: true })
  lat: number;

  @Column({ type: 'double', nullable: true })
  lng: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MenuItem, (m) => m.restaurant)
  menu: MenuItem[];

  @OneToMany(() => Order, (o) => o.restaurant)
  orders: Order[];
}
