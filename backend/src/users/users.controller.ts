import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getProfile(@Request() req) {
    try {
      const user = await this.usersService.findOne(req.user.id);
      return { user };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar perfil del usuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateProfile(@Request() req, @Body() updateData: { firstName?: string; lastName?: string; phone?: string; profileImage?: string }) {
    try {
      const user = await this.usersService.updateProfile(req.user.id, updateData);
      return { user };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  @Get('orders')
  @ApiOperation({ summary: 'Obtener órdenes del usuario' })
  @ApiResponse({ status: 200, description: 'Órdenes obtenidas exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getUserOrders(@Request() req) {
    const orders = await this.usersService.getUserOrders(req.user.id);
    return { orders };
  }

  @Delete('account')
  @ApiOperation({ summary: 'Eliminar cuenta del usuario' })
  @ApiResponse({ status: 200, description: 'Cuenta eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async deleteAccount(@Request() req) {
    await this.usersService.remove(req.user.id);
    return { message: 'Cuenta eliminada exitosamente' };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Obtener configuración del usuario' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getSettings(@Request() req) {
    const settings = await this.usersService.getSettings(req.user.id);
    return { settings };
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Actualizar configuración del usuario' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async updateSettings(@Request() req, @Body() settings: any) {
    const user = await this.usersService.updateSettings(req.user.id, settings);
    return { user };
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async changePassword(@Request() req, @Body() passwordData: { currentPassword: string; newPassword: string }) {
    await this.usersService.changePassword(req.user.id, passwordData.currentPassword, passwordData.newPassword);
    return { message: 'Contraseña cambiada exitosamente' };
  }
}
