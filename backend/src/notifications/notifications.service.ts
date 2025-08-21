import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan, LessThan } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      type,
      title,
      message,
      data,
    });
    return await this.notificationRepository.save(notification);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (notification) {
      notification.isRead = true;
      notification.status = NotificationStatus.READ;
      return await this.notificationRepository.save(notification);
    }
    return notification;
  }

  async markAllAsRead(): Promise<void> {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true, status: NotificationStatus.READ },
    );
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    read: number;
  }> {
    const [total, unread] = await Promise.all([
      this.notificationRepository.count(),
      this.notificationRepository.count({ where: { isRead: false } }),
    ]);

    return {
      total,
      unread,
      read: total - unread,
    };
  }

  // Método específico para notificaciones de stock bajo
  async createLowStockNotification(productName: string, currentStock: number): Promise<Notification> {
    console.log(`🔍 Verificando notificación de stock bajo para: ${productName} (stock: ${currentStock})`);
    
    // Verificar si ya existe una notificación reciente para este producto
    const recentNotification = await this.findRecentLowStockNotification(productName);
    
    if (recentNotification) {
      console.log(`⚠️ Notificación de stock bajo ya existe para ${productName}, no se creará duplicado`);
      return recentNotification;
    }

    console.log(`✅ Creando nueva notificación de stock bajo para: ${productName}`);
    const notification = await this.createNotification(
      NotificationType.LOW_STOCK,
      'Stock Bajo',
      `El producto "${productName}" tiene stock bajo (${currentStock} unidades restantes)`,
      { productName, currentStock },
    );
    
    console.log(`📝 Notificación creada con ID: ${notification.id}`);
    return notification;
  }

  // Buscar notificación reciente de stock bajo para un producto específico
  async findRecentLowStockNotification(productName: string): Promise<Notification | null> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hora atrás
    
    // Buscar por mensaje que contenga el nombre del producto
    return await this.notificationRepository.findOne({
      where: {
        type: NotificationType.LOW_STOCK,
        title: 'Stock Bajo',
        createdAt: MoreThan(oneHourAgo),
        message: Like(`%${productName}%`),
      },
      order: { createdAt: 'DESC' },
    });
  }

  // Limpiar notificaciones antiguas de stock bajo
  async cleanOldLowStockNotifications(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 día atrás
    
    await this.notificationRepository.delete({
      type: NotificationType.LOW_STOCK,
      createdAt: LessThan(oneDayAgo),
    });
    
    console.log('🧹 Notificaciones antiguas de stock bajo limpiadas');
  }

  // Método específico para notificaciones de nuevos pedidos
  async createNewOrderNotification(orderNumber: string, total: number): Promise<Notification> {
    return await this.createNotification(
      NotificationType.NEW_ORDER,
      'Nuevo Pedido',
      `Nuevo pedido #${orderNumber} recibido por $${total}`,
      { orderNumber, total },
    );
  }



  // Método específico para notificaciones de nuevas reseñas
  async createNewReviewNotification(productName: string, rating: number): Promise<Notification> {
    return await this.createNotification(
      NotificationType.NEW_REVIEW,
      'Nueva Reseña',
      `Nueva reseña de ${rating}/5 estrellas para "${productName}"`,
      { productName, rating },
    );
  }

  // Método específico para notificaciones de modo mantenimiento
  async createMaintenanceModeNotification(enabled: boolean): Promise<Notification> {
    const status = enabled ? 'activado' : 'desactivado';
    return await this.createNotification(
      NotificationType.MAINTENANCE_MODE,
      'Modo Mantenimiento',
      `El modo mantenimiento ha sido ${status}`,
      { enabled },
    );
  }
}
