import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { TicketCategory, TicketPriority } from '../entities/support-ticket.entity';

export class CreateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TicketCategory)
  category: TicketCategory;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsEmail()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  userName?: string;
}

export class UpdateSupportTicketDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TicketCategory)
  @IsOptional()
  category?: TicketCategory;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;
}

export class AdminResponseDto {
  @IsString()
  @IsNotEmpty()
  adminResponse: string;
}

export class UpdateTicketStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
