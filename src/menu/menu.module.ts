import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), RestaurantsModule],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
