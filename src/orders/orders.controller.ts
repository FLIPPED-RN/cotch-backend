import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  // клиент: оформить заказ (можно и без логина, но лучше хотя бы client jwt)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')

  @Patch('create') // можно Post, но оставлю Patch не принципиально
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orders.createOrder({
      restaurantId: dto.restaurantId,
      tableNumber: dto.tableNumber,
      items: dto.items,
      createdById: req.user.userId ?? null,
    });
  }

  // админ: список заказов своего ресторана
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('my')
  listMy(@Req() req: any, @Query('status') status?: 'NEW' | 'DONE') {
    return this.orders.getRestaurantOrders(req.user.restaurantId, status);
  }

  // админ: выполнить заказ
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/done')
  done(@Req() req: any, @Param('id') id: string) {
    return this.orders.markDone(Number(id), req.user.restaurantId);
  }
}
