import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'profileImage', 'role', 'emailVerified', 'createdAt', 'updatedAt']
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async updateProfile(id: string, updateData: { firstName?: string; lastName?: string; phone?: string; profileImage?: string }): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.profileImage) user.profileImage = updateData.profileImage;

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getUserOrders(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.items', 'orders.items.product'],
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user.orders;
  }

  async updateSettings(id: string, settings: any): Promise<User> {
    const user = await this.findOne(id);
    
    // Update user settings with the new structure
    if (settings.notifications) {
      user.notifications = JSON.stringify(settings.notifications);
    }
    if (settings.privacy) {
      user.privacy = JSON.stringify(settings.privacy);
    }

    return await this.userRepository.save(user);
  }

  async getSettings(id: string): Promise<any> {
    const user = await this.findOne(id);
    
    // Parse stored settings or use defaults
    let notifications = {
      emailNewsletter: false,
      emailOrders: false,
      emailPromotions: false,
      emailUpdates: false,
    };
    
    let privacy = {
      shareUsageData: false,
    };

    try {
      if (user.notifications) {
        notifications = { ...notifications, ...JSON.parse(user.notifications) };
      }
      if (user.privacy) {
        privacy = { ...privacy, ...JSON.parse(user.privacy) };
      }
    } catch (error) {
      console.error('Error parsing user settings:', error);
    }
    
    return {
      notifications,
      privacy,
    };
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'password']
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    user.password = newPassword;
    await this.userRepository.save(user);
  }
}
