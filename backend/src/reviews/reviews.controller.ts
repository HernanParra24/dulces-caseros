import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Request() req,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(
      req.user.id,
      createReviewDto.productId,
      createReviewDto.rating,
      createReviewDto.comment,
    );
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(
      req.user.id,
      reviewId,
      updateReviewDto.rating,
      updateReviewDto.comment,
    );
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(@Request() req, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(req.user.id, reviewId);
  }

  @Get('user/:productId')
  @UseGuards(JwtAuthGuard)
  async getUserReview(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.getUserReview(req.user.id, productId);
  }
}
