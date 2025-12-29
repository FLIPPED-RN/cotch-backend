import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant) private repo: Repository<Restaurant>,
    private geoService: GeoService,
  ) {}

  async create(data: Partial<Restaurant>) {
    // если передали address — пробуем получить координаты
    if (typeof data.address === 'string' && data.address.trim().length > 0) {
      const address = data.address.trim();
      const coords = await this.geoService.geocode(address);

      // ✅ не пишем null, если геокодинг не нашёл координаты
      if (coords?.lat != null && coords?.lng != null) {
        data.lat = coords.lat;
        data.lng = coords.lng;
      }
    }

    const r = this.repo.create(data);
    return this.repo.save(r);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Restaurant>) {
    const r = await this.findOne(id);
    if (!r) throw new NotFoundException('Ресторан не найден');

    // если меняем address — пересчитываем координаты
    if (typeof data.address === 'string' && data.address.trim().length > 0) {
      const newAddress = data.address.trim();
      const oldAddress = (r.address ?? '').trim();

      if (newAddress !== oldAddress) {
        const coords = await this.geoService.geocode(newAddress);

        // ✅ не пишем null, если геокодинг не нашёл координаты
        if (coords?.lat != null && coords?.lng != null) {
          data.lat = coords.lat;
          data.lng = coords.lng;
        }
      }
    }

    Object.assign(r, data);
    return this.repo.save(r);
  }

  async assertAdminOwnsRestaurant(
    adminRestaurantId: number | null,
    restaurantId: number,
  ) {
    if (!adminRestaurantId || adminRestaurantId !== restaurantId) {
      throw new ForbiddenException('Нет доступа к ресторану');
    }
  }
}
