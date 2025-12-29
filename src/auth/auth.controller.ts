import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register/client')
  registerClient(@Body() dto: RegisterClientDto) {
    return this.auth.registerClient(dto);
  }

  @Post('register/admin')
  registerAdmin(@Body() dto: RegisterAdminDto) {
    return this.auth.registerAdmin(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.phone, dto.password);
  }
}
