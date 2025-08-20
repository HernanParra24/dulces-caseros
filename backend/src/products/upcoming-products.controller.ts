import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UpcomingProductsService } from './upcoming-products.service';

@ApiTags('Productos Próximamente')
@Controller('upcoming-products')
export class UpcomingProductsController {
  constructor(private readonly upcomingProductsService: UpcomingProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos próximamente activos' })
  @ApiResponse({ status: 200, description: 'Lista de productos próximamente' })
  async findAll() {
    try {
      return await this.upcomingProductsService.findAll();
    } catch (error) {
      console.error('Error in controller findAll:', error);
      return [];
    }
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los productos próximamente (admin)' })
  @ApiResponse({ status: 200, description: 'Lista completa de productos próximamente' })
  async findAllForAdmin() {
    try {
      return await this.upcomingProductsService.findAllForAdmin();
    } catch (error) {
      console.error('Error in controller findAllForAdmin:', error);
      return [];
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto próximo' })
  @ApiResponse({ status: 201, description: 'Producto próximo creado exitosamente' })
  async create(@Body() createUpcomingProductDto: any) {
    return await this.upcomingProductsService.create(createUpcomingProductDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un producto próximo por ID' })
  @ApiResponse({ status: 200, description: 'Producto próximo encontrado' })
  async findOne(@Param('id') id: string) {
    return await this.upcomingProductsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto próximo' })
  @ApiResponse({ status: 200, description: 'Producto próximo actualizado exitosamente' })
  async update(@Param('id') id: string, @Body() updateUpcomingProductDto: any) {
    return await this.upcomingProductsService.update(id, updateUpcomingProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto próximo' })
  @ApiResponse({ status: 200, description: 'Producto próximo eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    return await this.upcomingProductsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/desactivar un producto próximo' })
  @ApiResponse({ status: 200, description: 'Estado del producto próximo cambiado' })
  async toggleActive(@Param('id') id: string) {
    return await this.upcomingProductsService.toggleActive(id);
  }

  @Patch(':id/sort-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar orden de un producto próximo' })
  @ApiResponse({ status: 200, description: 'Orden actualizado exitosamente' })
  async updateSortOrder(@Param('id') id: string, @Body() body: { sortOrder: number }) {
    return await this.upcomingProductsService.updateSortOrder(id, body.sortOrder);
  }
}
