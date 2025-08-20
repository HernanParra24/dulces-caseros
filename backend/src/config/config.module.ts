import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SiteConfig } from './entities/site-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteConfig]),
    NotificationsModule
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SystemConfigModule {}
