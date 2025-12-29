import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(MenuItem) private repo: Repository<MenuItem>) {}

  create(data: Partial<MenuItem>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  findByRestaurant(restaurantId: number) {
    return this.repo.find({ where: { restaurantId }, order: { id: 'DESC' } });
  }

  async update(id: number, data: Partial<MenuItem>) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Блюдо не найдено');
    Object.assign(item, data);
    return this.repo.save(item);
  }

  async delete(id: number) {
    const res = await this.repo.delete({ id });
    return { deleted: res.affected === 1 };
  }
}
