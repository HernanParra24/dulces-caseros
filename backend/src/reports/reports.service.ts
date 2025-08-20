import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (startDate && endDate) {
      queryBuilder.where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const orders = await queryBuilder.getMany();

    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === OrderStatus.DELIVERED).length;
    const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING).length;

    // Productos más vendidos
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.productName;
        if (!productSales[productName]) {
          productSales[productName] = { quantity: 0, revenue: 0 };
        }
        productSales[productName].quantity += item.quantity;
        productSales[productName].revenue += Number(item.totalPrice);
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]: [string, any]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Ventas por día
    const dailySales = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { sales: 0, orders: 0 };
      }
      dailySales[date].sales += Number(order.total);
      dailySales[date].orders += 1;
    });

    return {
      summary: {
        totalSales,
        totalOrders,
        completedOrders,
        pendingOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      },
      topProducts,
      dailySales: Object.entries(dailySales).map(([date, data]: [string, any]) => ({
        date,
        sales: data.sales,
        orders: data.orders,
      })),
    };
  }

  async getInventoryReport() {
    const products = await this.productRepository.find({
      where: { isActive: true },
      order: { stock: 'ASC' },
    });

    const totalProducts = products.length;
    const lowStockProducts = products.filter(product => product.stock <= 5);
    const outOfStockProducts = products.filter(product => product.stock === 0);
    const totalStockValue = products.reduce((sum, product) => sum + (Number(product.price) * product.stock), 0);

    const categoryBreakdown = {};
    products.forEach(product => {
      if (!categoryBreakdown[product.category]) {
        categoryBreakdown[product.category] = { count: 0, stock: 0 };
      }
      categoryBreakdown[product.category].count += 1;
      categoryBreakdown[product.category].stock += product.stock;
    });

    return {
      summary: {
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalStockValue,
      },
      lowStockProducts: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        price: product.price,
        category: product.category,
      })),
      outOfStockProducts: outOfStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
      })),
      categoryBreakdown: Object.entries(categoryBreakdown).map(([category, data]: [string, any]) => ({
        category,
        count: data.count,
        stock: data.stock,
      })),
    };
  }

  async getCustomersReport() {
    const users = await this.userRepository.find({
      where: { role: UserRole.USER },
      relations: ['orders'],
    });

    const totalCustomers = users.length;
    const activeCustomers = users.filter(user => user.orders && user.orders.length > 0).length;
    const newCustomersThisMonth = users.filter(user => {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
    }).length;

    // Clientes con más compras
    const customerStats = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      totalOrders: user.orders ? user.orders.length : 0,
      totalSpent: user.orders ? user.orders.reduce((sum, order) => sum + Number(order.total), 0) : 0,
      lastOrder: user.orders && user.orders.length > 0 
        ? user.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null,
    }));

    const topCustomers = customerStats
      .filter(customer => customer.totalOrders > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      summary: {
        totalCustomers,
        activeCustomers,
        newCustomersThisMonth,
        averageOrdersPerCustomer: activeCustomers > 0 ? customerStats.reduce((sum, customer) => sum + customer.totalOrders, 0) / activeCustomers : 0,
      },
      topCustomers,
      customerStats,
    };
  }

  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.paymentStatus = :paymentStatus', { paymentStatus: PaymentStatus.PAID });

    if (startDate && endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const orders = await queryBuilder.getMany();

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Ingresos por método de pago
    const paymentMethodRevenue = {};
    orders.forEach(order => {
      const method = order.paymentMethod;
      if (!paymentMethodRevenue[method]) {
        paymentMethodRevenue[method] = { revenue: 0, orders: 0 };
      }
      paymentMethodRevenue[method].revenue += Number(order.total);
      paymentMethodRevenue[method].orders += 1;
    });

    // Ingresos por mes
    const monthlyRevenue = {};
    orders.forEach(order => {
      const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = { revenue: 0, orders: 0 };
      }
      monthlyRevenue[month].revenue += Number(order.total);
      monthlyRevenue[month].orders += 1;
    });

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
      },
      paymentMethodRevenue: Object.entries(paymentMethodRevenue).map(([method, data]: [string, any]) => ({
        method,
        revenue: data.revenue,
        orders: data.orders,
        percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      })),
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, data]: [string, any]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      })),
    };
  }

  async getGeneralReport() {
    const [salesReport, inventoryReport, customersReport, revenueReport] = await Promise.all([
      this.getSalesReport(),
      this.getInventoryReport(),
      this.getCustomersReport(),
      this.getRevenueReport(),
    ]);

    return {
      sales: salesReport,
      inventory: inventoryReport,
      customers: customersReport,
      revenue: revenueReport,
      generatedAt: new Date(),
    };
  }
}
