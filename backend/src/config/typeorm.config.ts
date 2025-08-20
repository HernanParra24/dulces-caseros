import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { UpcomingProduct } from '../products/entities/upcoming-product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { SupportTicket } from '../support/entities/support-ticket.entity';
import { ContactMessage } from '../contact/entities/contact-message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { SiteConfig } from './entities/site-config.entity';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
                    url: this.configService.get<string>('DATABASE_URL') || 'postgresql://postgres:your_password@localhost:5432/dulces_caseros',
      entities: [User, Product, UpcomingProduct, Order, OrderItem, Review, Favorite, SupportTicket, ContactMessage, Notification, SiteConfig],
      synchronize: true,
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}
