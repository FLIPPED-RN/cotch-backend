import { IsString, MinLength } from 'class-validator';

export class RegisterClientDto {
  @IsString()
  phone: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
