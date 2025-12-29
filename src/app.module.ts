import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { MenuItem } from './menu/menu-item.entity';
import { Order } from './orders/order.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItem } from './orders/order-item.entity';
import { ConfigModule } from '@nestjs/config';
import { GeoModule } from './geo/geo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Restaurant, MenuItem, Order, OrderItem],
      synchronize: true,
    }),
    AuthModule,
    GeoModule,
    UsersModule,
    RestaurantsModule,
    MenuModule,
    OrdersModule,
  ],
})
export class AppModule {}
