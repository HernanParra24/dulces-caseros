import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateSupportTicketDto, UpdateSupportTicketDto, AdminResponseDto, UpdateTicketStatusDto } from './dto/support-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SupportTicket } from './entities/support-ticket.entity';

@ApiTags('support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un ticket de soporte' })
  @ApiResponse({ status: 201, description: 'Ticket creado exitosamente', type: SupportTicket })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createSupportTicketDto: CreateSupportTicketDto, @Request() req) {
    return await this.supportService.create(createSupportTicketDto, req.user);
  }

  @Post('public')
  @ApiOperation({ summary: 'Crear un ticket de soporte público (sin autenticación)' })
  @ApiResponse({ status: 201, description: 'Ticket creado exitosamente', type: SupportTicket })
  async createPublic(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return await this.supportService.create(createSupportTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tickets de soporte (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de tickets', type: [SupportTicket] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Request() req) {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      throw new Error('Acceso denegado');
    }
    return await this.supportService.findAll();
  }

  @Get('my-tickets')
  @ApiOperation({ summary: 'Obtener mis tickets de soporte' })
  @ApiResponse({ status: 200, description: 'Lista de mis tickets', type: [SupportTicket] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findMyTickets(@Request() req) {
    return await this.supportService.findMyTickets(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ticket de soporte por ID' })
  @ApiResponse({ status: 200, description: 'Ticket encontrado', type: SupportTicket })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string, @Request() req) {
    const ticket = await this.supportService.findOne(id);
    
    // Verificar que el usuario puede ver este ticket
    if (req.user.role !== 'admin' && ticket.userId !== req.user.id) {
      throw new Error('Acceso denegado');
    }
    
    return ticket;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ticket de soporte' })
  @ApiResponse({ status: 200, description: 'Ticket actualizado', type: SupportTicket })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateSupportTicketDto: UpdateSupportTicketDto, @Request() req) {
    return await this.supportService.update(id, updateSupportTicketDto, req.user);
  }

  @Patch(':id/admin-response')
  @ApiOperation({ summary: 'Agregar respuesta de admin a un ticket' })
  @ApiResponse({ status: 200, description: 'Respuesta agregada', type: SupportTicket })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addAdminResponse(@Param('id') id: string, @Body() adminResponseDto: AdminResponseDto, @Request() req) {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      throw new Error('Acceso denegado');
    }
    return await this.supportService.addAdminResponse(id, adminResponseDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de un ticket' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: SupportTicket })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateTicketStatusDto, @Request() req) {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      throw new Error('Acceso denegado');
    }
    return await this.supportService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ticket de soporte' })
  @ApiResponse({ status: 200, description: 'Ticket eliminado' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string, @Request() req) {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      throw new Error('Acceso denegado. Solo administradores pueden eliminar tickets.');
    }
    return await this.supportService.remove(id, req.user);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Obtener estadísticas de tickets (solo admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de tickets' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTicketStats(@Request() req) {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      throw new Error('Acceso denegado');
    }
    return await this.supportService.getTicketStats();
  }
}
