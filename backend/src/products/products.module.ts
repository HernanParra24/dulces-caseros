import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UpcomingProductsController } from './upcoming-products.controller';
import { UpcomingProductsService } from './upcoming-products.service';
import { Product } from './entities/product.entity';
import { UpcomingProduct } from './entities/upcoming-product.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, UpcomingProduct]), NotificationsModule],
  controllers: [ProductsController, UpcomingProductsController],
  providers: [ProductsService, UpcomingProductsService],
  exports: [ProductsService, UpcomingProductsService],
})
export class ProductsModule {}
