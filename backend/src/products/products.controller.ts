import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from '../notifications/notifications.service';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos exitosamente' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados' })
  @ApiResponse({ status: 200, description: 'Productos destacados obtenidos exitosamente' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener categorías de productos' })
  @ApiResponse({ status: 200, description: 'Categorías obtenidas exitosamente' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos' })
  @ApiResponse({ status: 200, description: 'Búsqueda realizada exitosamente' })
  searchProducts(@Query('q') searchTerm: string) {
    return this.productsService.searchProducts(searchTerm);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Obtener productos por categoría' })
  @ApiResponse({ status: 200, description: 'Productos de la categoría obtenidos exitosamente' })
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('check-low-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar productos con stock bajo' })
  @ApiResponse({ status: 200, description: 'Verificación completada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async checkLowStock() {
    await this.productsService.checkLowStockProducts();
    return { message: 'Verificación de stock bajo completada' };
  }

  @Post('force-low-stock-check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forzar verificación de productos con stock bajo (limpia notificaciones antiguas)' })
  @ApiResponse({ status: 200, description: 'Verificación forzada completada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async forceLowStockCheck() {
    // Limpiar notificaciones antiguas primero
    await this.notificationsService.cleanOldLowStockNotifications();
    
    // Forzar verificación de stock bajo
    await this.productsService.checkLowStockProducts();
    
    return { message: 'Verificación forzada de stock bajo completada' };
  }
}
