import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { UsersModule } from '../users/users.module';
import { GeoModule } from 'src/geo/geo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), UsersModule, GeoModule],
  providers: [RestaurantsService],
  controllers: [RestaurantsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
