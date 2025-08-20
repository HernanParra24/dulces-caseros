import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user?: User): Promise<Order> {
    console.log('🛒 Creando orden para usuario:', user?.id, user?.email);
    console.log('📦 Datos de la orden:', { customerEmail: createOrderDto.customerEmail, itemsCount: createOrderDto.items.length });
    
    const { items, ...orderData } = createOrderDto;

    // Validar productos y calcular totales
    let subtotal = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      
      if (!product.isInStock || product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
        productName: product.name,
        productImage: product.mainImage,
      });
    }

    // Calcular envío
    const shippingCost = subtotal >= 8000 ? 0 : 5000;
    const total = subtotal + shippingCost;

    // Generar número de orden
    const orderNumber = this.generateOrderNumber();

    // Crear la orden
    const order = this.orderRepository.create({
      ...orderData,
      orderNumber,
      userId: user?.id,
      subtotal,
      shippingCost,
      total,
      items: orderItems,
    });

    console.log('💾 Guardando orden con userId:', order.userId, 'customerEmail:', order.customerEmail);
    const savedOrder = await this.orderRepository.save(order);
    console.log('✅ Orden guardada con ID:', savedOrder.id);

    // Actualizar stock de productos
    for (const item of items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    return await this.findOne(savedOrder.id, user);
  }

  async findAll(query: OrderQueryDto): Promise<{ orders: Order[]; total: number }> {
    const {
      status,
      customerEmail,
      orderNumber,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.user', 'user');

    // Filtros
    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (customerEmail) {
      queryBuilder.andWhere('order.customerEmail ILIKE :customerEmail', { customerEmail: `%${customerEmail}%` });
    }

    if (orderNumber) {
      queryBuilder.andWhere('order.orderNumber ILIKE :orderNumber', { orderNumber: `%${orderNumber}%` });
    }

    // Ordenamiento
    queryBuilder.orderBy(`order.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    const [orders, total] = await queryBuilder.getManyAndCount();

    return { orders, total };
  }

  async findOne(id: string, user?: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Validar permisos: solo el propietario o admin puede ver la orden
    if (user && user.role !== 'admin' && order.userId !== user.id) {
      throw new ForbiddenException('No tienes permisos para ver esta orden');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string, user?: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    // Validar permisos: solo el propietario o admin puede ver la orden
    if (user && user.role !== 'admin' && order.userId !== user.id) {
      throw new ForbiddenException('No tienes permisos para ver esta orden');
    }

    return order;
  }

  async findOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, user?: User): Promise<Order> {
    const order = await this.findOne(id, user);
    
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(updateOrderStatusDto.status as OrderStatus)) {
      throw new BadRequestException('Estado de orden inválido');
    }

    order.status = updateOrderStatusDto.status as OrderStatus;
    
    // Si se marca como entregada, actualizar fecha de entrega
    if (order.status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    return await this.orderRepository.save(order);
  }

    async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paymentId?: string, user?: User): Promise<Order> {
    const order = await this.findOne(id, user);
    
    order.paymentStatus = paymentStatus;
    if (paymentId) {
      order.paymentId = paymentId;
    }
    
    return await this.orderRepository.save(order);
  }

  async updatePaymentProof(id: string, updatePaymentProofDto: { paymentProof: string }, user?: User): Promise<Order> {
    const order = await this.findOne(id, user);
    
    order.paymentProof = updatePaymentProofDto.paymentProof;
    
    return await this.orderRepository.save(order);
  }

  async getUserOrders(userId: string, userEmail?: string): Promise<Order[]> {
    console.log('🔍 Buscando pedidos para userId:', userId, 'email:', userEmail);
    
    // Incluir pedidos antiguos o creados sin token (userId null) pero con el mismo email
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.userId = :userId', { userId });

    if (userEmail) {
      query.orWhere('LOWER(order.customerEmail) = LOWER(:email)', { email: userEmail });
    }

    const orders = await query.orderBy('order.createdAt', 'DESC').getMany();
    console.log('📦 Pedidos encontrados:', orders.length);
    console.log('📋 Detalles de pedidos:', orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      customerEmail: o.customerEmail,
      itemsCount: o.items?.length || 0
    })));
    
    return orders;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const [totalOrders, totalRevenue, pendingOrders, completedOrders] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'total')
        .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
        .getRawOne()
        .then(result => parseFloat(result.total) || 0),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
    ]);

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
  }
}
