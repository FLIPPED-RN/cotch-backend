import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { StringValue } from 'ms';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterClientDto } from './dto/register-client.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async registerAdmin(dto: RegisterAdminDto) {
    const existing = await this.users.findByPhone(dto.phone);
    if (existing) throw new BadRequestException('Телефон уже зарегистрирован');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.create({
      phone: dto.phone,
      passwordHash,
      role: 'ADMIN',
      restaurantId: null,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
    });

    return this.sign(user);
  }

  async registerClient(dto: RegisterClientDto) {
    const existing = await this.users.findByPhone(dto.phone);
    if (existing) throw new BadRequestException('Телефон уже зарегистрирован');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.users.create({
      phone: dto.phone,
      passwordHash,
      role: 'CLIENT',
      restaurantId: null,
      firstName: dto.firstName ?? null,
      lastName: dto.lastName ?? null,
    });

    return this.sign(user);
  }

  async login(phone: string, password: string) {
    const user = await this.users.findByPhone(phone);
    if (!user) throw new UnauthorizedException('Неверный телефон или пароль');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Неверный телефон или пароль');

    return this.sign(user);
  }

  private async sign(user: {
    id: number;
    phone: string;
    role: string;
    restaurantId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
  }) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      restaurantId: user.restaurantId ?? null,
    };

    const expiresIn = (process.env.JWT_EXPIRES ?? '7d') as StringValue;

    const accessToken = await this.jwt.signAsync(payload, { expiresIn });

    const safeUser = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      restaurantId: user.restaurantId ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
    };

    return { accessToken, user: safeUser };
  }
}
