import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:your_password@localhost:5432/dulces_caseros',
  entities: [User, Product, UpcomingProduct, Order, OrderItem, Review, Favorite, SupportTicket, ContactMessage, Notification],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
