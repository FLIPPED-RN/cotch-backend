import { IsString, IsOptional } from 'class-validator';

export class MarkOrderDoneDto {
  @IsOptional()
  @IsString()
  note?: string;
}
