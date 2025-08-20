import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AddToFavoritesDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getFavorites(userId: string): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async addToFavorites(userId: string, productId: string): Promise<Favorite> {
    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Check if already favorited
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });
    if (existingFavorite) {
      throw new ConflictException('El producto ya está en favoritos');
    }

    const favorite = this.favoriteRepository.create({
      userId,
      productId,
    });

    return await this.favoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async removeFavoriteById(userId: string, favoriteId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id: favoriteId, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async isFavorite(userId: string, productId: string): Promise<{ isFavorite: boolean }> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, productId },
    });

    return { isFavorite: !!favorite };
  }

  async getFavoritesCount(userId: string): Promise<number> {
    return await this.favoriteRepository.count({
      where: { userId },
    });
  }
}

