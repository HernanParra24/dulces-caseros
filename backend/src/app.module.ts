import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { ContactModule } from './contact/contact.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SystemConfigModule } from './config/config.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmConfig } from './config/typeorm.config';
import { UploadModule } from './common/modules/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    FavoritesModule,
    AdminModule,
    SupportModule,
    ContactModule,
    NotificationsModule,
    SystemConfigModule,
    ReportsModule,
    UploadModule,
  ],
})
export class AppModule {}
