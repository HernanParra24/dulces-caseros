import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { SiteConfig } from './entities/site-config.entity';

@Injectable()
export class ConfigService {
  constructor(
    private notificationsService: NotificationsService,
    @InjectRepository(SiteConfig)
    private siteConfigRepository: Repository<SiteConfig>
  ) {}

  async setMaintenanceMode(enabled: boolean): Promise<void> {
    const config = await this.getOrCreateConfig();
    config.maintenanceMode = enabled;
    await this.siteConfigRepository.save(config);
    
    // Crear notificación sobre el cambio de modo mantenimiento
    await this.notificationsService.createMaintenanceModeNotification(enabled);
  }

  getMaintenanceMode(): boolean {
    return false; // Temporal, se actualizará cuando se implemente la recuperación
  }

  async getSystemConfig() {
    const config = await this.getOrCreateConfig();
    return {
      maintenanceMode: config.maintenanceMode,
      storeName: config.storeName,
      storeEmail: config.storeEmail,
      storePhone: config.storePhone,
      storeAddress: config.storeAddress,
      currency: config.currency,
      timezone: config.timezone,
      logoUrl: config.logoUrl,
      heroImageUrl: config.heroImageUrl,
    };
  }

  async updateSystemConfig(updateData: Partial<SiteConfig>) {
    const config = await this.getOrCreateConfig();
    Object.assign(config, updateData);
    return await this.siteConfigRepository.save(config);
  }

  async updateLogo(logoUrl: string) {
    const config = await this.getOrCreateConfig();
    config.logoUrl = logoUrl;
    return await this.siteConfigRepository.save(config);
  }

  async getLogo() {
    const config = await this.getOrCreateConfig();
    return config.logoUrl;
  }

  async updateHeroImage(heroImageUrl: string) {
    const config = await this.getOrCreateConfig();
    config.heroImageUrl = heroImageUrl;
    return await this.siteConfigRepository.save(config);
  }

  async getHeroImage() {
    const config = await this.getOrCreateConfig();
    return config.heroImageUrl;
  }

  private async getOrCreateConfig(): Promise<SiteConfig> {
    let config = await this.siteConfigRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' }
    });

    if (!config) {
      config = this.siteConfigRepository.create({
        storeName: 'Dulce Twilight',
        storeEmail: 'dulcetwilightdc2609@gmail.com',
        storePhone: '+54 9 261 123-4567',
        storeAddress: 'Mendoza, Argentina',
        currency: 'ARS',
        timezone: 'America/Argentina/Mendoza',
        maintenanceMode: false,
      });
      await this.siteConfigRepository.save(config);
    }

    return config;
  }
}
