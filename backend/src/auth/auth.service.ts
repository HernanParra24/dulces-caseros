import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { EmailVerificationService } from '../common/services/email-verification.service';
import { AdminEmailService } from '../common/services/admin-email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailVerificationService: EmailVerificationService,
    private adminEmailService: AdminEmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, firstName, lastName, phone, acceptPrivacyPolicy, acceptTerms } = registerDto;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar aceptación de políticas
    if (!acceptPrivacyPolicy) {
      throw new BadRequestException('Debes aceptar las políticas de privacidad');
    }

    if (!acceptTerms) {
      throw new BadRequestException('Debes aceptar los términos y condiciones');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear el usuario
    const user = this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      emailVerified: false, // Verificación opcional
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    // Enviar email de verificación
    try {
      await this.emailVerificationService.sendVerificationEmail(user.email, user.id);
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      // No fallar el registro si el email falla, pero informar al usuario
    }

    return {
      message: 'Usuario registrado exitosamente. Por favor verifica tu email para activar tu cuenta.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log('🔐 Intentando login para:', email);

    // Buscar usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('👤 Usuario encontrado:', user.email, 'Role:', user.role, 'EmailVerified:', user.emailVerified);

    // Verificar contraseña
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Contraseña inválida para:', email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('✅ Contraseña válida para:', email);

    // Verificar que el email esté verificado
    if (!user.emailVerified) {
      console.log('❌ Email no verificado para:', email);
      throw new UnauthorizedException('Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo email de verificación.');
    }

    console.log('✅ Email verificado, procediendo con login para:', email);

    // Generar tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    return this.emailVerificationService.sendVerificationEmail(user.email, user.id);
  }

  async verifyEmail(token: string) {
    const result = await this.emailVerificationService.verifyEmailToken(token);
    
    // Actualizar el usuario como verificado
    const user = await this.userRepository.findOne({ where: { id: result.userId } });
    if (user) {
      user.emailVerified = true;
      await this.userRepository.save(user);
    }
    
    return { message: 'Email verificado exitosamente' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    return this.emailVerificationService.sendVerificationEmail(user.email, user.id);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // No revelar si el email existe o no
      return {
        message: 'Si el email existe, se enviará un enlace de recuperación',
      };
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await this.userRepository.save(user);

    // Enviar email de recuperación
    try {
      await this.adminEmailService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        passwordResetToken
      );
      console.log('✅ Email de recuperación enviado a:', user.email);
    } catch (error) {
      console.error('❌ Error enviando email de recuperación:', error);
      // No fallar si el email falla
    }

    return {
      message: 'Si el email existe, se enviará un enlace de recuperación',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token de recuperación inválido');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('El token de recuperación ha expirado');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar nuevo token de acceso
      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }
}
