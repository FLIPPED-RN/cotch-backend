import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsNumber()
  restaurantId: number;

  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
