import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage, ContactStatus } from './entities/contact-message.entity';
import { CreateContactMessageDto, UpdateContactMessageDto } from './dto/contact-message.dto';
import { AdminEmailService } from '../common/services/admin-email.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactMessageRepository: Repository<ContactMessage>,
    private adminEmailService: AdminEmailService,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto, userId?: string): Promise<ContactMessage> {
    const contactMessage = this.contactMessageRepository.create({
      ...createContactMessageDto,
      userId,
    });
    return await this.contactMessageRepository.save(contactMessage);
  }

  async findAll(): Promise<ContactMessage[]> {
    return await this.contactMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findMyMessages(userId: string): Promise<ContactMessage[]> {
    return await this.contactMessageRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContactMessage> {
    const contactMessage = await this.contactMessageRepository.findOne({
      where: { id },
    });

    if (!contactMessage) {
      throw new NotFoundException(`Mensaje de contacto con ID ${id} no encontrado`);
    }

    return contactMessage;
  }

  async update(id: string, updateContactMessageDto: UpdateContactMessageDto): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    
    Object.assign(contactMessage, updateContactMessageDto);
    
    // Si se está respondiendo, actualizar la fecha de respuesta
    if (updateContactMessageDto.status === ContactStatus.RESPONDED && updateContactMessageDto.respuesta) {
      contactMessage.respondedAt = new Date();
    }
    
    return await this.contactMessageRepository.save(contactMessage);
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    contactMessage.status = ContactStatus.READ;
    return await this.contactMessageRepository.save(contactMessage);
  }

  async respond(id: string, respuesta: string): Promise<ContactMessage> {
    const contactMessage = await this.findOne(id);
    contactMessage.status = ContactStatus.RESPONDED;
    contactMessage.respuesta = respuesta;
    contactMessage.respondedAt = new Date();
    
    // Guardar la respuesta en la base de datos
    const savedMessage = await this.contactMessageRepository.save(contactMessage);
    
    // Enviar email automático al usuario
    try {
      await this.adminEmailService.sendContactResponseEmail(
        contactMessage.email,
        contactMessage.nombre,
        contactMessage.asunto,
        respuesta
      );
      console.log(`✅ Email de respuesta enviado a: ${contactMessage.email}`);
    } catch (error) {
      console.error(`❌ Error enviando email de respuesta a ${contactMessage.email}:`, error);
      // No lanzamos el error para no afectar la respuesta del admin
    }
    
    return savedMessage;
  }

  async remove(id: string): Promise<void> {
    const contactMessage = await this.findOne(id);
    await this.contactMessageRepository.remove(contactMessage);
  }

  async getStats() {
    const total = await this.contactMessageRepository.count();
    const newMessages = await this.contactMessageRepository.count({
      where: { status: ContactStatus.NEW },
    });
    const readMessages = await this.contactMessageRepository.count({
      where: { status: ContactStatus.READ },
    });
    const respondedMessages = await this.contactMessageRepository.count({
      where: { status: ContactStatus.RESPONDED },
    });

    return {
      total,
      new: newMessages,
      read: readMessages,
      responded: respondedMessages,
    };
  }
}
