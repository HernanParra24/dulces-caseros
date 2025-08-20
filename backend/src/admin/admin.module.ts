import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEmailService } from '../common/services/admin-email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { SupportTicket } from '../support/entities/support-ticket.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, OrderItem, Review, SupportTicket, Notification, Favorite])],
  controllers: [AdminController],
  providers: [AdminService, AdminEmailService, NotificationsService],
  exports: [AdminService, AdminEmailService],
})
export class AdminModule {}
