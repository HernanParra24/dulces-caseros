import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }

  @Get('unread')
  async getUnreadNotifications() {
    return await this.notificationsService.getUnreadNotifications();
  }

  @Get('stats')
  async getNotificationStats() {
    return await this.notificationsService.getNotificationStats();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  async markAllAsRead() {
    await this.notificationsService.markAllAsRead();
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    await this.notificationsService.deleteNotification(id);
    return { message: 'Notificación eliminada' };
  }
}
