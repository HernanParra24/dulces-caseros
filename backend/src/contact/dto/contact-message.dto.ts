import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+54 261 563-2310', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @ApiProperty({ example: 'Consulta sobre productos' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  asunto: string;

  @ApiProperty({ example: 'Hola, me gustaría saber más sobre sus productos...' })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  mensaje: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateContactMessageDto {
  @ApiProperty({ enum: ['new', 'read', 'responded', 'closed'] })
  @IsString()
  status: string;

  @ApiProperty({ example: 'Gracias por tu consulta...', required: false })
  @IsOptional()
  @IsString()
  respuesta?: string;
}

export class ContactMessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefono?: string;

  @ApiProperty()
  asunto: string;

  @ApiProperty()
  mensaje: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  respuesta?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  respondedAt?: Date;

  @ApiProperty()
  formattedCreatedAt: string;
}
