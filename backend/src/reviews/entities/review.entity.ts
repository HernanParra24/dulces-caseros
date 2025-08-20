import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 0 })
  rating: number; // 1-5 estrellas

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean; // Para verificar que el usuario compró el producto

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get formattedRating(): string {
    return this.rating.toFixed(1);
  }

  get userDisplayName(): string {
    if (this.user) {
      return `${this.user.firstName} ${this.user.lastName.charAt(0)}.`;
    }
    return 'Usuario';
  }
}
