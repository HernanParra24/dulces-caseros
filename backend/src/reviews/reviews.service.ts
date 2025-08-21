import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    // Validar que el rating esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('El rating debe estar entre 1 y 5');
    }

    // Verificar que el producto existe
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario ya ha dejado una reseña para este producto
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, productId },
    });
    if (existingReview) {
      throw new BadRequestException('Ya has dejado una reseña para este producto');
    }

    // Crear la nueva reseña
    const review = this.reviewRepository.create({
      userId,
      productId,
      rating,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Actualizar el rating promedio y el conteo de reseñas del producto
    await this.updateProductRating(productId);

    return savedReview;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      console.log('Getting reviews for product:', productId);
      // Verificar si la tabla existe primero
      const tableExists = await this.reviewRepository.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews')"
      );
      
      if (!tableExists[0].exists) {
        console.log('Reviews table does not exist');
        return [];
      }
      
      const reviews = await this.reviewRepository.find({
        where: { productId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      console.log('Found reviews:', reviews.length);
      return reviews;
    } catch (error) {
      console.error('Error getting product reviews:', error);
      return [];
    }
  }

  async updateReview(
    userId: string,
    reviewId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    // Validar que el rating esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('El rating debe estar entre 1 y 5');
    }

    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, userId },
      relations: ['product'],
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await this.reviewRepository.save(review);

    // Actualizar el rating promedio del producto
    await this.updateProductRating(review.productId);

    return updatedReview;
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, userId },
      relations: ['product'],
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    const productId = review.productId;
    await this.reviewRepository.remove(review);

    // Actualizar el rating promedio del producto
    await this.updateProductRating(productId);
  }

  private async updateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { productId },
    });

    if (reviews.length === 0) {
      // Si no hay reseñas, resetear a 0
      await this.productRepository.update(productId, {
        rating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.productRepository.update(productId, {
      rating: averageRating,
      reviewCount: reviews.length,
    });
  }

  async getUserReview(userId: string, productId: string): Promise<Review | null> {
    try {
      console.log('Getting user review for user:', userId, 'product:', productId);
      // Verificar si la tabla existe primero
      const tableExists = await this.reviewRepository.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews')"
      );
      
      if (!tableExists[0].exists) {
        console.log('Reviews table does not exist');
        return null;
      }
      
      const review = await this.reviewRepository.findOne({
        where: { userId, productId },
      });
      console.log('Found user review:', review ? 'yes' : 'no');
      return review;
    } catch (error) {
      console.error('Error getting user review:', error);
      return null;
    }
  }
}
