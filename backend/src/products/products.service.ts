import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product, ProductCategory } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    // Verificar si el producto se crea con stock bajo
    if (savedProduct.stock <= 5 && savedProduct.stock > 0) {
      await this.notificationsService.createLowStockNotification(
        savedProduct.name,
        savedProduct.stock
      );
    }

    return savedProduct;
  }

  async findAll(query: ProductQueryDto): Promise<{ products: Product[]; total: number }> {
    const {
      search,
      category,
      featured,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Filtros
    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (featured !== undefined) {
      queryBuilder.andWhere('product.isFeatured = :featured', { featured });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Solo productos activos
    queryBuilder.andWhere('product.isActive = :isActive', { isActive: true });

    // Ordenamiento
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async findFeatured(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { isFeatured: true, isActive: true },
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const previousStock = product.stock;
    
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    // Verificar si el stock bajó de 5 unidades y crear notificación
    if (previousStock > 5 && updatedProduct.stock <= 5 && updatedProduct.stock > 0) {
      // Verificar si ya existe una notificación reciente para este producto
      const existingNotification = await this.notificationsService.findRecentLowStockNotification(updatedProduct.name);
      
      if (!existingNotification) {
        await this.notificationsService.createLowStockNotification(
          updatedProduct.name,
          updatedProduct.stock
        );
      }
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.stock < quantity) {
      throw new BadRequestException('Stock insuficiente');
    }

    const previousStock = product.stock;
    product.stock -= quantity;
    const updatedProduct = await this.productRepository.save(product);

    // Verificar si el stock bajó de 5 unidades y crear notificación
    if (previousStock > 5 && updatedProduct.stock <= 5 && updatedProduct.stock > 0) {
      // Verificar si ya existe una notificación reciente para este producto
      const existingNotification = await this.notificationsService.findRecentLowStockNotification(updatedProduct.name);
      
      if (!existingNotification) {
        await this.notificationsService.createLowStockNotification(
          updatedProduct.name,
          updatedProduct.stock
        );
      }
    }

    return updatedProduct;
  }

  async getCategories(): Promise<ProductCategory[]> {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .getRawMany();

    return categories.map(cat => cat.category);
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: [
        { name: Like(`%${searchTerm}%`), isActive: true },
        { description: Like(`%${searchTerm}%`), isActive: true },
        { ingredients: Like(`%${searchTerm}%`), isActive: true },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async checkLowStockProducts(): Promise<void> {
    console.log('🔍 Iniciando verificación de productos con stock bajo...');
    
    const lowStockProducts = await this.productRepository.find({
      where: {
        stock: Between(1, 5),
        isActive: true,
      },
    });

    console.log(`📦 Encontrados ${lowStockProducts.length} productos con stock bajo (≤5)`);
    
    for (const product of lowStockProducts) {
      console.log(`🔍 Verificando producto: ${product.name} (stock: ${product.stock})`);
      
      // Verificar si ya existe una notificación reciente para este producto
      const existingNotification = await this.notificationsService.findRecentLowStockNotification(product.name);
      
      if (!existingNotification) {
        console.log(`📝 Creando notificación para: ${product.name}`);
        await this.notificationsService.createLowStockNotification(
          product.name,
          product.stock
        );
      } else {
        console.log(`⚠️ Notificación ya existe para: ${product.name}`);
      }
    }
    
    console.log('✅ Verificación de stock bajo completada');
  }
}
