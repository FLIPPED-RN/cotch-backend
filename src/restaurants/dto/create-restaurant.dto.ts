import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  description?: string;
}
