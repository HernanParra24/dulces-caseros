import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactMessageDto, UpdateContactMessageDto, ContactMessageResponseDto } from './dto/contact-message.dto';
import { ContactMessage } from './entities/contact-message.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Enviar mensaje de contacto (público y autenticado)' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createContactMessageDto: CreateContactMessageDto, @Request() req): Promise<{ message: string }> {
    // El guard opcional nos proporciona req.user si el token es válido
    const userId = req.user?.id;
    
    if (userId) {
      console.log(`✅ Usuario autenticado: ${userId}`);
    } else {
      console.log('Usuario no autenticado, enviando mensaje sin userId');
    }
    
    await this.contactService.create(createContactMessageDto, userId);
    return { message: 'Mensaje enviado exitosamente. Te responderemos pronto.' };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los mensajes de contacto (admin)' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes', type: [ContactMessageResponseDto] })
  async findAll(): Promise<ContactMessage[]> {
    return await this.contactService.findAll();
  }

  @Get('my-messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis mensajes de contacto' })
  @ApiResponse({ status: 200, description: 'Lista de mis mensajes', type: [ContactMessageResponseDto] })
  async findMyMessages(@Request() req): Promise<ContactMessage[]> {
    return await this.contactService.findMyMessages(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de mensajes (admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de mensajes' })
  async getStats() {
    return await this.contactService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un mensaje de contacto por ID (admin)' })
  @ApiResponse({ status: 200, description: 'Mensaje encontrado', type: ContactMessageResponseDto })
  @ApiResponse({ status: 404, description: 'Mensaje no encontrado' })
  async findOne(@Param('id') id: string): Promise<ContactMessage> {
    return await this.contactService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar mensaje como leído (admin)' })
  @ApiResponse({ status: 200, description: 'Mensaje marcado como leído' })
  async markAsRead(@Param('id') id: string): Promise<ContactMessage> {
    return await this.contactService.markAsRead(id);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Responder a un mensaje (admin)' })
  @ApiResponse({ status: 200, description: 'Respuesta enviada' })
  async respond(
    @Param('id') id: string,
    @Body() body: { respuesta: string }
  ): Promise<ContactMessage> {
    return await this.contactService.respond(id, body.respuesta);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar mensaje de contacto (admin)' })
  @ApiResponse({ status: 200, description: 'Mensaje actualizado' })
  async update(
    @Param('id') id: string,
    @Body() updateContactMessageDto: UpdateContactMessageDto
  ): Promise<ContactMessage> {
    return await this.contactService.update(id, updateContactMessageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar mensaje de contacto (admin)' })
  @ApiResponse({ status: 204, description: 'Mensaje eliminado' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.contactService.remove(id);
  }
}
