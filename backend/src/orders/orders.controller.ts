import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdatePaymentProofDto, OrderQueryDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Órdenes')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const user = req.user;
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las órdenes (solo admin)' })
  @ApiResponse({ status: 200, description: 'Órdenes obtenidas exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener órdenes del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Órdenes obtenidas exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getMyOrders(@Request() req) {
    return this.ordersService.getUserOrders(req.user.id, req.user.email);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de órdenes (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user);
  }

  @Get('number/:orderNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener orden por número de orden' })
  @ApiResponse({ status: 200, description: 'Orden obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findByOrderNumber(@Param('orderNumber') orderNumber: string, @Request() req) {
    return this.ordersService.findByOrderNumber(orderNumber, req.user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de la orden (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @Request() req) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto, req.user);
  }

  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de pago de la orden' })
  @ApiResponse({ status: 200, description: 'Estado de pago actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: string; paymentId?: string },
    @Request() req
  ) {
    return this.ordersService.updatePaymentStatus(id, body.paymentStatus as any, body.paymentId, req.user);
  }

  @Patch(':id/payment-proof')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir comprobante de pago' })
  @ApiResponse({ status: 200, description: 'Comprobante subido exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  updatePaymentProof(
    @Param('id') id: string,
    @Body() updatePaymentProofDto: UpdatePaymentProofDto,
    @Request() req
  ) {
    return this.ordersService.updatePaymentProof(id, updatePaymentProofDto, req.user);
  }
}
