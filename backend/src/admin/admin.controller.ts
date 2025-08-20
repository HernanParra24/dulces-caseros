import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { OrderStatus, PaymentStatus } from '../orders/entities/order.entity';

@ApiTags('Administración')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Middleware para verificar que el usuario es admin
  private async checkAdminRole(req: any) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new Error('Acceso denegado. Solo administradores pueden acceder a esta funcionalidad.');
    }
  }

  // Dashboard
  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getDashboardStats(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  async getAllUsers(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  async getUserById(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Actualizar rol de usuario' })
  @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente' })
  async updateUserRole(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { role: UserRole }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateUserRole(id, body.role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  async deleteUser(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.deleteUser(id);
  }

  @Put('users/:id/password')
  @ApiOperation({ summary: 'Actualizar contraseña de usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente' })
  async updateUserPassword(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { newPassword: string }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateUserPassword(id, body.newPassword);
  }

  @Put('users/:id/email')
  @ApiOperation({ summary: 'Actualizar email de usuario' })
  @ApiResponse({ status: 200, description: 'Email actualizado exitosamente' })
  async updateUserEmail(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { newEmail: string }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateUserEmail(id, body.newEmail);
  }

  @Get('users/:id/notification-preferences')
  @ApiOperation({ summary: 'Obtener preferencias de notificaciones de usuario' })
  @ApiResponse({ status: 200, description: 'Preferencias obtenidas exitosamente' })
  async getUserNotificationPreferences(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getUserNotificationPreferences(id);
  }

  @Get('users/notification-preferences/all')
  @ApiOperation({ summary: 'Obtener preferencias de notificaciones de todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Preferencias obtenidas exitosamente' })
  async getAllUsersNotificationPreferences(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllUsersNotificationPreferences();
  }

  @Get('users/notification-preferences/type/:type')
  @ApiOperation({ summary: 'Obtener usuarios que tienen habilitado un tipo específico de notificación' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  async getUsersByNotificationType(@Request() req, @Param('type') type: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getUsersByNotificationType(type);
  }

  @Put('users/:id/profile')
  @ApiOperation({ summary: 'Actualizar perfil de usuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  async updateUserProfile(
    @Request() req,
    @Param('id') id: string,
    @Body() profileData: any
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateUserProfile(id, profileData);
  }

  @Put('users/:id/reset-email-verification')
  @ApiOperation({ summary: 'Resetear verificación de email' })
  @ApiResponse({ status: 200, description: 'Verificación reseteada exitosamente' })
  async resetUserEmailVerification(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.resetUserEmailVerification(id);
  }

  @Get('users/:id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getUserStats(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getUserStats(id);
  }

  // Product Management
  @Get('products')
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos exitosamente' })
  async getAllProducts(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto obtenido exitosamente' })
  async getProductById(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getProductById(id);
  }

  @Post('products')
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  async createProduct(@Request() req, @Body() productData: any) {
    await this.checkAdminRole(req);
    return await this.adminService.createProduct(productData);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  async updateProduct(@Request() req, @Param('id') id: string, @Body() productData: any) {
    await this.checkAdminRole(req);
    return await this.adminService.updateProduct(id, productData);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  async deleteProduct(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.deleteProduct(id);
  }

  // Order Management
  @Get('orders')
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({ status: 200, description: 'Pedidos obtenidos exitosamente' })
  async getAllOrders(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllOrders();
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido obtenido exitosamente' })
  async getOrderById(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.getOrderById(id);
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Actualizar estado del pedido' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  async updateOrderStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: OrderStatus }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateOrderStatus(id, body.status);
  }

  @Patch('orders/:id/payment-status')
  @ApiOperation({ summary: 'Actualizar estado de pago del pedido' })
  @ApiResponse({ status: 200, description: 'Estado de pago actualizado exitosamente' })
  async updateOrderPaymentStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { paymentStatus: PaymentStatus }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.updateOrderPaymentStatus(id, body.paymentStatus);
  }

  @Delete('orders/:id')
  @ApiOperation({ summary: 'Eliminar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  async deleteOrder(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.deleteOrder(id);
  }

  // Review Management
  @Get('reviews')
  @ApiOperation({ summary: 'Obtener todas las reseñas' })
  @ApiResponse({ status: 200, description: 'Reseñas obtenidas exitosamente' })
  async getAllReviews(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllReviews();
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Eliminar reseña' })
  @ApiResponse({ status: 200, description: 'Reseña eliminada exitosamente' })
  async deleteReview(@Request() req, @Param('id') id: string) {
    await this.checkAdminRole(req);
    return await this.adminService.deleteReview(id);
  }

  // Support Management
  @Get('support/users')
  @ApiOperation({ summary: 'Obtener usuarios que necesitan soporte' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente' })
  async getUsersNeedingSupport(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getUsersNeedingSupport();
  }

  // Email Management
  @Get('emails/users')
  @ApiOperation({ summary: 'Obtener emails de todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Emails obtenidos exitosamente' })
  async getAllUserEmails(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.getAllUserEmails();
  }

  @Post('emails/newsletter/all')
  @ApiOperation({ summary: 'Enviar newsletter a todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Newsletter enviado exitosamente' })
  async sendNewsletterToAllUsers(
    @Request() req,
    @Body() body: { subject: string; content: string }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.sendNewsletterToAllUsers(body.subject, body.content);
  }

  @Post('emails/newsletter/specific')
  @ApiOperation({ summary: 'Enviar newsletter a usuarios específicos' })
  @ApiResponse({ status: 200, description: 'Newsletter enviado exitosamente' })
  async sendNewsletterToSpecificUsers(
    @Request() req,
    @Body() body: { emails: string[]; subject: string; content: string }
  ) {
    await this.checkAdminRole(req);
    return await this.adminService.sendNewsletterToSpecificUsers(body.emails, body.subject, body.content);
  }

  @Get('emails/test-connection')
  @ApiOperation({ summary: 'Probar conexión de email' })
  @ApiResponse({ status: 200, description: 'Conexión probada exitosamente' })
  async testEmailConnection(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.testEmailConnection();
  }

  // Notifications Management
  @Post('notifications/clean-old')
  @ApiOperation({ summary: 'Limpiar notificaciones antiguas de stock bajo' })
  @ApiResponse({ status: 200, description: 'Notificaciones limpiadas exitosamente' })
  async cleanOldNotifications(@Request() req) {
    await this.checkAdminRole(req);
    return await this.adminService.cleanOldNotifications();
  }
}
