import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from './entities/support-ticket.entity';
import { CreateSupportTicketDto, UpdateSupportTicketDto, AdminResponseDto, UpdateTicketStatusDto } from './dto/support-ticket.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicket)
    private supportTicketRepository: Repository<SupportTicket>,
  ) {}

  async create(createSupportTicketDto: CreateSupportTicketDto, user?: User): Promise<SupportTicket> {
    const ticket = this.supportTicketRepository.create({
      ...createSupportTicketDto,
      userId: user?.id,
      userEmail: user?.email || createSupportTicketDto.userEmail,
      userName: user ? `${user.firstName} ${user.lastName}` : createSupportTicketDto.userName,
    });

    return await this.supportTicketRepository.save(ticket);
  }

  async findAll(): Promise<SupportTicket[]> {
    return await this.supportTicketRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findMyTickets(userId: string): Promise<SupportTicket[]> {
    return await this.supportTicketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SupportTicket> {
    const ticket = await this.supportTicketRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket de soporte no encontrado');
    }

    return ticket;
  }

  async update(id: string, updateSupportTicketDto: UpdateSupportTicketDto, user?: User): Promise<SupportTicket> {
    const ticket = await this.findOne(id);

    // Verificar que el usuario solo puede actualizar sus propios tickets
    if (user && ticket.userId !== user.id) {
      throw new BadRequestException('No puedes actualizar tickets de otros usuarios');
    }

    Object.assign(ticket, updateSupportTicketDto);
    return await this.supportTicketRepository.save(ticket);
  }

  async addAdminResponse(id: string, adminResponseDto: AdminResponseDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);
    
    ticket.adminResponse = adminResponseDto.adminResponse;
    ticket.status = TicketStatus.IN_PROGRESS;
    
    return await this.supportTicketRepository.save(ticket);
  }

  async updateStatus(id: string, updateStatusDto: UpdateTicketStatusDto): Promise<SupportTicket> {
    const ticket = await this.findOne(id);
    
    if (!Object.values(TicketStatus).includes(updateStatusDto.status as TicketStatus)) {
      throw new BadRequestException('Estado de ticket inválido');
    }

    ticket.status = updateStatusDto.status as TicketStatus;
    
    if (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) {
      ticket.resolvedAt = new Date();
    }

    return await this.supportTicketRepository.save(ticket);
  }

  async remove(id: string, user?: User): Promise<{ message: string }> {
    const ticket = await this.findOne(id);

    // Los administradores pueden eliminar cualquier ticket
    // Los usuarios normales solo pueden eliminar sus propios tickets
    if (user && user.role !== 'admin' && ticket.userId !== user.id) {
      throw new BadRequestException('No puedes eliminar tickets de otros usuarios');
    }

    await this.supportTicketRepository.remove(ticket);
    return { message: 'Ticket de soporte eliminado exitosamente' };
  }

  async getTicketStats(): Promise<any> {
    const totalTickets = await this.supportTicketRepository.count();
    const openTickets = await this.supportTicketRepository.count({
      where: { status: TicketStatus.OPEN },
    });
    const inProgressTickets = await this.supportTicketRepository.count({
      where: { status: TicketStatus.IN_PROGRESS },
    });
    const resolvedTickets = await this.supportTicketRepository.count({
      where: { status: TicketStatus.RESOLVED },
    });

    return {
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
    };
  }
}
