import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  // Endpoint público para obtener información básica del sitio
  @Get('public')
  async getPublicConfig() {
    const config = await this.configService.getSystemConfig();
    return {
      storeName: config.storeName,
      logoUrl: config.logoUrl,
      heroImageUrl: config.heroImageUrl,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSystemConfig() {
    return await this.configService.getSystemConfig();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSystemConfig(@Body() updateData: any) {
    const updated = await this.configService.updateSystemConfig(updateData);
    return { 
      message: 'Configuración actualizada exitosamente',
      config: updated 
    };
  }

  @Post('maintenance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setMaintenanceMode(@Body() body: { enabled: boolean }) {
    await this.configService.setMaintenanceMode(body.enabled);
    return { 
      message: `Modo mantenimiento ${body.enabled ? 'activado' : 'desactivado'}`,
      maintenanceMode: body.enabled 
    };
  }

  @Get('maintenance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getMaintenanceMode() {
    return { maintenanceMode: this.configService.getMaintenanceMode() };
  }

  @Put('logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateLogo(@Body() body: { logoUrl: string }) {
    const updated = await this.configService.updateLogo(body.logoUrl);
    return { 
      message: 'Logo actualizado exitosamente',
      logoUrl: updated.logoUrl 
    };
  }

  @Get('logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getLogo() {
    const logoUrl = await this.configService.getLogo();
    return { logoUrl };
  }

  @Put('hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateHeroImage(@Body() body: { heroImageUrl: string }) {
    const updated = await this.configService.updateHeroImage(body.heroImageUrl);
    return { 
      message: 'Imagen del hero actualizada exitosamente',
      heroImageUrl: updated.heroImageUrl 
    };
  }

  @Get('hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getHeroImage() {
    const heroImageUrl = await this.configService.getHeroImage();
    return { heroImageUrl };
  }
}
