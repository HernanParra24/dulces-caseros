import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min, MinLength, IsEmail, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({ example: 'product-id-123' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(2)
  customerName: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+56912345678' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ example: 'Av. Providencia 123, Santiago, Chile' })
  @IsString()
  @MinLength(10)
  shippingAddress: string;

  @ApiProperty({ example: 'Av. Providencia 123, Santiago, Chile' })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MERCADO_PAGO })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 'Entregar después de las 6 PM' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'https://example.com/proof.jpg' })
  @IsOptional()
  @IsString()
  paymentProof?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'confirmed' })
  @IsString()
  status: string;
}

export class UpdatePaymentProofDto {
  @ApiProperty({ example: 'https://example.com/proof.jpg' })
  @IsString()
  @IsUrl()
  paymentProof: string;
}

export class OrderQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
