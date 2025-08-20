import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Trufas de Chocolate' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'Deliciosas trufas de chocolate artesanal' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 'Chocolate negro, crema, azúcar, cacao en polvo' })
  @IsString()
  ingredients: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.TRUFAS })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: ['/images/trufa1.jpg', '/images/trufa2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: '200g' })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ example: 'Contiene leche y frutos secos' })
  @IsOptional()
  @IsString()
  allergens?: string;

  @ApiProperty({ example: 'Calorías: 150, Grasas: 8g, Carbohidratos: 18g' })
  @IsOptional()
  @IsString()
  nutritionalInfo?: string;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Trufas de Chocolate Premium' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({ example: 'Deliciosas trufas de chocolate artesanal premium' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiProperty({ example: 'Chocolate negro premium, crema, azúcar, cacao en polvo' })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @ApiProperty({ example: 3000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 75 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ enum: ProductCategory })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiProperty({ example: ['/images/trufa1.jpg', '/images/trufa2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: '200g' })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ example: 'Contiene leche y frutos secos' })
  @IsOptional()
  @IsString()
  allergens?: string;

  @ApiProperty({ example: 'Calorías: 150, Grasas: 8g, Carbohidratos: 18g' })
  @IsOptional()
  @IsString()
  nutritionalInfo?: string;
}

export class ProductQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: ProductCategory, required: false })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
