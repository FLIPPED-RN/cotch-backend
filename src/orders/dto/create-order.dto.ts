import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  MinLength,
} from 'class-validator';

class CreateOrderItemDto {
  @IsNumber()
  menuItemId: number;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @IsNumber()
  restaurantId: number;

  @IsString()
  @MinLength(1)
  tableNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
