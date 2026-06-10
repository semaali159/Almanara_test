import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShipmentDto {
  @IsString()
  orderId: string;

  @Type(() => Number)
  @IsNumber()
  weight: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}