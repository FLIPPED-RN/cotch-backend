import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Controller('menu')
export class MenuController {
  constructor(
    private menu: MenuService,
    private restaurants: RestaurantsService,
  ) {}

  @Get('restaurant/:restaurantId')
  find(@Param('restaurantId') restaurantId: string) {
    return this.menu.findByRestaurant(Number(restaurantId));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Req() req: any, @Body() dto: CreateMenuItemDto) {
    await this.restaurants.assertAdminOwnsRestaurant(
      req.user.restaurantId,
      dto.restaurantId,
    );
    return this.menu.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {

    return this.menu.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menu.delete(Number(id));
  }
}
