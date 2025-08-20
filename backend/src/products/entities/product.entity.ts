import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum ProductCategory {
  CHOCOLATES = 'chocolates',
  CARAMELOS = 'caramelos',
  GALLETAS = 'galletas',
  PASTELES = 'pasteles',
  BOMBONES = 'bombones',
  TRUFAS = 'trufas',
  DULCES = 'dulces',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  ingredients: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  weight: string; // formato: "450g", "1kg", etc.

  @Column({ type: 'text', nullable: true })
  allergens: string;

  @Column({ type: 'text', nullable: true })
  nutritionalInfo: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isInStock(): boolean {
    return this.stock > 0;
  }

  get formattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  get mainImage(): string {
    return this.images?.[0] || '/images/default-product.jpg';
  }
}
