import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMenuItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
