import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToFavoritesDto } from './dto/favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.id);
  }

  @Post()
  async addToFavorites(
    @Request() req,
    @Body() addToFavoritesDto: AddToFavoritesDto,
  ) {
    return this.favoritesService.addToFavorites(
      req.user.id,
      addToFavoritesDto.productId,
    );
  }

  @Delete(':productId')
  async removeFromFavorites(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    await this.favoritesService.removeFromFavorites(req.user.id, productId);
    return { message: 'Producto removido de favoritos' };
  }

  @Delete('id/:favoriteId')
  async removeFavoriteById(
    @Request() req,
    @Param('favoriteId') favoriteId: string,
  ) {
    await this.favoritesService.removeFavoriteById(req.user.id, favoriteId);
    return { message: 'Favorito removido exitosamente' };
  }

  @Get(':productId/check')
  async isFavorite(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.favoritesService.isFavorite(req.user.id, productId);
  }

  @Get('count')
  async getFavoritesCount(@Request() req) {
    const count = await this.favoritesService.getFavoritesCount(req.user.id);
    return { count };
  }
}

