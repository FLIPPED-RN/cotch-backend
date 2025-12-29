import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, (r) => r.menu, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
