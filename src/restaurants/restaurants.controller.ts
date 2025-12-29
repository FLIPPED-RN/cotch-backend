import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private restaurants: RestaurantsService,
    private users: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.restaurants.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const r = await this.restaurants.findOne(Number(id));
    return r;
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Req() req: any, @Body() dto: CreateRestaurantDto) {
    const restaurant = await this.restaurants.create(dto);
    await this.users.attachRestaurant(req.user.userId, restaurant.id);
    return restaurant;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    const restaurantId = Number(id);
    await this.restaurants.assertAdminOwnsRestaurant(
      req.user.restaurantId,
      restaurantId,
    );
    return this.restaurants.update(restaurantId, dto);
  }
}
