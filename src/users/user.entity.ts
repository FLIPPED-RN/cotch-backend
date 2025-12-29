import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 10 })
  role: 'ADMIN' | 'CLIENT';

  // если админ привязан к ресторану — можно хранить restaurantId
  @Column({ type: 'int', nullable: true })
  restaurantId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Order, (o) => o.createdBy)
  orders: Order[];
}
