import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contraseña123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'contraseña123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'confirmar123' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ example: '+56912345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: true, description: 'Aceptación de políticas de privacidad' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  acceptPrivacyPolicy: boolean;

  @ApiProperty({ example: true, description: 'Aceptación de términos y condiciones' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  acceptTerms: boolean;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'nueva123' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'nueva123' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
