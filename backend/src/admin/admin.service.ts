import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus, PaymentStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { SupportTicket } from '../support/entities/support-ticket.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { AdminEmailService } from '../common/services/admin-email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(SupportTicket)
    private supportTicketRepository: Repository<SupportTicket>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private adminEmailService: AdminEmailService,
    private notificationsService: NotificationsService,
  ) {}

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.USER } }),
      this.productRepository.count(),
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.status = :status', { status: OrderStatus.DELIVERED })
        .getRawOne(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue?.total || 0,
      pendingOrders,
      completedOrders,
    };
  }

  // User Management
  async getAllUsers() {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async updateUserRole(id: string, role: UserRole) {
    const user = await this.getUserById(id);
    user.role = role;
    return await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    
    // Verificar si el usuario tiene tickets de soporte
    const supportTickets = await this.supportTicketRepository.find({
      where: { userId: id }
    });

    if (supportTickets.length > 0) {
      // Si tiene tickets, actualizar los tickets para remover la referencia al usuario
      await this.supportTicketRepository.update(
        { userId: id },
        { 
          userId: null,
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`
        }
      );
    }

    // Eliminar el usuario
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado exitosamente' };
  }

  async updateUserPassword(id: string, newPassword: string) {
    const user = await this.getUserById(id);
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  async updateUserEmail(id: string, newEmail: string) {
    const user = await this.getUserById(id);
    
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({ 
      where: { email: newEmail },
      select: ['id']
    });
    
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('El email ya está en uso por otro usuario');
    }
    
    user.email = newEmail;
    user.emailVerified = false; // Resetear verificación de email
    return await this.userRepository.save(user);
  }

  async updateUserProfile(id: string, profileData: any) {
    const user = await this.getUserById(id);
    
    // Actualizar campos permitidos
    if (profileData.firstName) user.firstName = profileData.firstName;
    if (profileData.lastName) user.lastName = profileData.lastName;
    if (profileData.phone) user.phone = profileData.phone;
    
    return await this.userRepository.save(user);
  }

  async resetUserEmailVerification(id: string) {
    const user = await this.getUserById(id);
    user.emailVerified = false;
    return await this.userRepository.save(user);
  }

  async getUserStats(id: string) {
    const user = await this.getUserById(id);
    
    // Obtener estadísticas del usuario
    const [totalOrders, totalSpent, totalReviews] = await Promise.all([
      this.orderRepository.count({ where: { userId: id } }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.userId = :userId', { userId: id })
        .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
        .getRawOne(),
      this.reviewRepository.count({ where: { userId: id } }),
    ]);

    return {
      user,
      stats: {
        totalOrders,
        totalSpent: totalSpent?.total || 0,
        totalReviews,
      }
    };
  }

  // Product Management
  async getAllProducts() {
    return await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async createProduct(productData: any) {
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async updateProduct(id: string, productData: any) {
    const product = await this.getProductById(id);
    Object.assign(product, productData);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    try {
      console.log('🗑️ Intentando eliminar producto:', id);
      
      const product = await this.getProductById(id);
      
      // Verificar si el producto está en algún pedido
      const orderItemsWithProduct = await this.orderRepository
        .createQueryBuilder('order')
        .innerJoin('order.items', 'item')
        .where('item.productId = :productId', { productId: id })
        .getCount();
      
      if (orderItemsWithProduct > 0) {
        throw new BadRequestException(
          `No se puede eliminar el producto porque está incluido en ${orderItemsWithProduct} pedido(s). ` +
          'Primero debe eliminar los pedidos que contengan este producto.'
        );
      }
      
      // Verificar si el producto está en favoritos
      const favoritesWithProduct = await this.favoriteRepository
        .createQueryBuilder('favorite')
        .where('favorite.productId = :productId', { productId: id })
        .getCount();
      
      if (favoritesWithProduct > 0) {
        console.log('🗑️ Eliminando favoritos del producto...');
        await this.favoriteRepository
          .createQueryBuilder()
          .delete()
          .from('favorites')
          .where('productId = :productId', { productId: id })
          .execute();
      }
      
      // Verificar si el producto tiene reviews
      const reviewsWithProduct = await this.reviewRepository
        .createQueryBuilder('review')
        .where('review.productId = :productId', { productId: id })
        .getCount();
      
      if (reviewsWithProduct > 0) {
        console.log('🗑️ Eliminando reviews del producto...');
        await this.reviewRepository
          .createQueryBuilder()
          .delete()
          .from('reviews')
          .where('productId = :productId', { productId: id })
          .execute();
      }
      
      // Ahora eliminar el producto
      console.log('🗑️ Eliminando producto...');
      await this.productRepository.remove(product);
      
      console.log('✅ Producto eliminado exitosamente');
      return { message: 'Producto eliminado exitosamente' };
      
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }

  // Order Management
  async getAllOrders() {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.getOrderById(id);
    
    // Validar que el estado sea válido
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado de orden inválido');
    }
    
    order.status = status;
    
    // Si se marca como entregada, actualizar fecha de entrega
    if (order.status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    
    return await this.orderRepository.save(order);
  }

  async updateOrderPaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const order = await this.getOrderById(id);
    order.paymentStatus = paymentStatus;
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: string) {
    try {
      console.log('🗑️ Intentando eliminar orden:', id);
      
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['items'],
      });
      
      if (!order) {
        throw new NotFoundException('Pedido no encontrado');
      }
      
      console.log('📦 Orden encontrada:', {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        itemsCount: order.items?.length || 0
      });
      
      // Verificar si el pedido puede ser eliminado
      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException('No se puede eliminar un pedido que ya ha sido entregado');
      }
      
      // Eliminar primero los items de la orden
      if (order.items && order.items.length > 0) {
        console.log('🗑️ Eliminando items de la orden...');
        await this.orderRepository
          .createQueryBuilder()
          .delete()
          .from('order_items')
          .where('orderId = :orderId', { orderId: order.id })
          .execute();
      }
      
      // Luego eliminar la orden
      console.log('🗑️ Eliminando orden...');
      await this.orderRepository.remove(order);
      
      console.log('✅ Orden eliminada exitosamente');
      return { message: 'Pedido eliminado exitosamente' };
      
    } catch (error) {
      console.error('❌ Error eliminando orden:', error);
      throw error;
    }
  }

  // Review Management
  async getAllReviews() {
    return await this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteReview(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }
    await this.reviewRepository.remove(review);
    return { message: 'Reseña eliminada exitosamente' };
  }

  // Support Management
  async getUsersNeedingSupport() {
    // Aquí puedes implementar lógica para identificar usuarios que necesitan soporte
    // Por ejemplo, usuarios con pedidos pendientes por mucho tiempo
    const usersWithPendingOrders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.status = :status', { status: OrderStatus.PENDING })
      .andWhere('order.createdAt < :date', { 
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 días atrás
      })
      .getMany();

    return usersWithPendingOrders.map(order => ({
      userId: order.user.id,
      email: order.user.email,
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      issue: 'Pedido pendiente por más de 7 días',
    }));
  }

  // Email Management
  async getAllUserEmails(): Promise<string[]> {
    const users = await this.userRepository.find({
      select: ['email'],
      where: { role: UserRole.USER }
    });
    return users.map(user => user.email);
  }

  async sendNewsletterToAllUsers(subject: string, content: string) {
    const emails = await this.getAllUserEmails();
    if (emails.length === 0) {
      throw new BadRequestException('No hay usuarios registrados para enviar emails');
    }

    const result = await this.adminEmailService.sendBulkNewsletter(emails, subject, content);
    
    return {
      message: 'Newsletter enviado',
      totalEmails: emails.length,
      successCount: result.success.length,
      failedCount: result.failed.length,
      successEmails: result.success,
      failedEmails: result.failed,
    };
  }

  async sendNewsletterToSpecificUsers(emails: string[], subject: string, content: string) {
    if (emails.length === 0) {
      throw new BadRequestException('No se proporcionaron emails');
    }

    const result = await this.adminEmailService.sendBulkNewsletter(emails, subject, content);
    
    return {
      message: 'Newsletter enviado a usuarios específicos',
      totalEmails: emails.length,
      successCount: result.success.length,
      failedCount: result.failed.length,
      successEmails: result.success,
      failedEmails: result.failed,
    };
  }

  async testEmailConnection() {
    const isConnected = await this.adminEmailService.testConnection();
    return {
      connected: isConnected,
      message: isConnected ? 'Conexión de email exitosa' : 'Error en la conexión de email',
    };
  }

  // Notifications Management
  async cleanOldNotifications() {
    await this.notificationsService.cleanOldLowStockNotifications();
    return {
      message: 'Notificaciones antiguas de stock bajo limpiadas exitosamente',
    };
  }

  // User Notification Preferences
  async getUserNotificationPreferences(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Parse stored settings or use defaults
    let notifications = {
      emailNewsletter: false,
      emailOrders: false,
      emailPromotions: false,
      emailUpdates: false,
    };

    try {
      if (user.notifications) {
        notifications = { ...notifications, ...JSON.parse(user.notifications) };
      }
    } catch (error) {
      console.error('Error parsing user notification preferences:', error);
    }

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      notificationPreferences: notifications,
    };
  }

  async getAllUsersNotificationPreferences() {
    const users = await this.userRepository.find({
      where: { role: UserRole.USER },
      select: ['id', 'email', 'firstName', 'lastName', 'notifications'],
    });

    return users.map(user => {
      let notifications = {
        emailNewsletter: false,
        emailOrders: false,
        emailPromotions: false,
        emailUpdates: false,
      };

      try {
        if (user.notifications) {
          notifications = { ...notifications, ...JSON.parse(user.notifications) };
        }
      } catch (error) {
        console.error('Error parsing user notification preferences:', error);
      }

      return {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        notificationPreferences: notifications,
      };
    });
  }

  async getUsersByNotificationType(notificationType: string) {
    const users = await this.userRepository.find({
      where: { role: UserRole.USER },
      select: ['id', 'email', 'firstName', 'lastName', 'notifications'],
    });

    const usersWithPreference = users.filter(user => {
      let notifications = {
        emailNewsletter: false,
        emailOrders: false,
        emailPromotions: false,
        emailUpdates: false,
      };

      try {
        if (user.notifications) {
          notifications = { ...notifications, ...JSON.parse(user.notifications) };
        }
      } catch (error) {
        console.error('Error parsing user notification preferences:', error);
      }

      return notifications[notificationType] === true;
    });

    return usersWithPreference.map(user => ({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  }
}
