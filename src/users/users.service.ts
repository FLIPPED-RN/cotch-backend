import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async attachRestaurant(adminId: number, restaurantId: number) {
    await this.repo.update({ id: adminId }, { restaurantId });
    return this.findById(adminId);
  }
}
