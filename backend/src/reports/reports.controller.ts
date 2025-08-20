import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Obtener reporte de ventas' })
  @ApiResponse({ status: 200, description: 'Reporte de ventas generado' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  async getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.reportsService.getSalesReport(start, end);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Obtener reporte de inventario' })
  @ApiResponse({ status: 200, description: 'Reporte de inventario generado' })
  @ApiBearerAuth()
  async getInventoryReport() {
    return await this.reportsService.getInventoryReport();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Obtener reporte de clientes' })
  @ApiResponse({ status: 200, description: 'Reporte de clientes generado' })
  @ApiBearerAuth()
  async getCustomersReport() {
    return await this.reportsService.getCustomersReport();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Obtener reporte de ingresos' })
  @ApiResponse({ status: 200, description: 'Reporte de ingresos generado' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.reportsService.getRevenueReport(start, end);
  }

  @Get('general')
  @ApiOperation({ summary: 'Obtener reporte general completo' })
  @ApiResponse({ status: 200, description: 'Reporte general generado' })
  @ApiBearerAuth()
  async getGeneralReport() {
    return await this.reportsService.getGeneralReport();
  }
}
