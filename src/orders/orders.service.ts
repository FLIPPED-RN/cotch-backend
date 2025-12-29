import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { MenuItem } from '../menu/menu-item.entity'; // <-- поправь путь если другой

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    @InjectRepository(MenuItem) private menuRepo: Repository<MenuItem>,
  ) {}

  async createOrder(params: {
    restaurantId: number;
    tableNumber: string;
    items: Array<{ menuItemId: number; qty: number }>;
    createdById: number | null;
  }) {
    if (!params.items?.length) {
      throw new BadRequestException('Корзина пустая');
    }

    const ids = params.items.map((i) => i.menuItemId);
    const menuItems = await this.menuRepo.find({ where: { id: In(ids) } });

    const byId = new Map(menuItems.map((m) => [m.id, m]));

    // проверим, что все позиции существуют и принадлежат этому ресторану
    for (const it of params.items) {
      const m = byId.get(it.menuItemId);
      if (!m)
        throw new BadRequestException(`Блюдо ${it.menuItemId} не найдено`);
      if (m.restaurantId !== params.restaurantId) {
        throw new ForbiddenException(
          'Нельзя заказать блюдо из другого ресторана',
        );
      }
    }

    const orderItems = params.items.map((it) => {
      const m = byId.get(it.menuItemId)!;
      return this.itemsRepo.create({
        menuItemId: m.id,
        title: m.title,
        price: m.price,
        qty: it.qty,
      });
    });

    const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = this.ordersRepo.create({
      restaurantId: params.restaurantId,
      tableNumber: params.tableNumber,
      status: 'NEW',
      total,
      createdById: params.createdById,
      items: orderItems,
    });

    return this.ordersRepo.save(order);
  }

  async getRestaurantOrders(restaurantId: number, status?: 'NEW' | 'DONE') {
    const where: any = { restaurantId };
    if (status) where.status = status;

    return this.ordersRepo.find({
      where,
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async markDone(orderId: number, adminRestaurantId: number) {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    if (order.restaurantId !== adminRestaurantId)
      throw new ForbiddenException('Нет доступа к заказу');

    order.status = 'DONE';
    return this.ordersRepo.save(order);
  }
}
