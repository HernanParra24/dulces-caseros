import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpcomingProduct } from './entities/upcoming-product.entity';

@Injectable()
export class UpcomingProductsService {
  constructor(
    @InjectRepository(UpcomingProduct)
    private upcomingProductRepository: Repository<UpcomingProduct>,
  ) {}

  async create(createUpcomingProductDto: any): Promise<UpcomingProduct> {
    const product = this.upcomingProductRepository.create(createUpcomingProductDto);
    const savedProduct = await this.upcomingProductRepository.save(product);
    return savedProduct as unknown as UpcomingProduct;
  }

  async findAll(): Promise<UpcomingProduct[]> {
    try {
      return await this.upcomingProductRepository.find({
        where: { isActive: true },
        order: { sortOrder: 'ASC', createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  async findAllForAdmin(): Promise<UpcomingProduct[]> {
    try {
      return await this.upcomingProductRepository.find({
        order: { sortOrder: 'ASC', createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error in findAllForAdmin:', error);
      return [];
    }
  }

  async findOne(id: string): Promise<UpcomingProduct> {
    return await this.upcomingProductRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUpcomingProductDto: any): Promise<UpcomingProduct> {
    await this.upcomingProductRepository.update(id, updateUpcomingProductDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.upcomingProductRepository.delete(id);
  }

  async toggleActive(id: string): Promise<UpcomingProduct> {
    const product = await this.findOne(id);
    product.isActive = !product.isActive;
    return await this.upcomingProductRepository.save(product);
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<UpcomingProduct> {
    await this.upcomingProductRepository.update(id, { sortOrder });
    return await this.findOne(id);
  }
}
