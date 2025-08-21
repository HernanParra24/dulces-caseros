import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailVerificationService {
  private transporter: nodemailer.Transporter;

  constructor(private jwtService: JwtService) {
    // Usar la misma configuración de Gmail que funciona para el newsletter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dulcetwilightdc@gmail.com',
        pass: 'zlhe avfy gmcz msns', // Contraseña de aplicación de Gmail
      },
    });
  }

  async sendVerificationEmail(email: string, userId: string): Promise<void> {
    try {
      // Generar token de verificación (válido por 24 horas)
      const verificationToken = this.jwtService.sign(
        { userId, email, type: 'email-verification' },
        { expiresIn: '24h' }
      );

      const frontendUrl = process.env.FRONTEND_URL || 'https://dulces-caseros.vercel.app';
      const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: '"Dulces Caseros - Verificación" <dulcetwilightdc@gmail.com>',
        to: email,
        subject: '🍰 Verifica tu cuenta de Dulces Caseros',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="color: #e67e22; margin: 0;">🍰 Dulces Caseros</h1>
              <p style="color: #666; margin: 10px 0;">Verificación de cuenta</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333;">¡Hola! 👋</h2>
              <p>Gracias por registrarte en <strong>Dulces Caseros</strong>. Para completar tu registro y disfrutar de todas las funcionalidades, por favor verifica tu dirección de correo electrónico.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #e67e22; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  ✅ Verificar mi cuenta
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>¿No funciona el botón?</strong><br>
                Copia y pega este enlace en tu navegador:<br>
                <a href="${verificationUrl}" style="color: #e67e22;">${verificationUrl}</a>
              </p>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>💡 Nota:</strong> Este enlace es válido por 24 horas. Si no verificas tu cuenta en este tiempo, puedes solicitar un nuevo enlace desde tu perfil.
                </p>
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2024 Dulces Caseros. Todos los derechos reservados.
              </p>
              <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">
                Si no solicitaste esta verificación, puedes ignorar este email.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de verificación enviado exitosamente a: ${email}`);
    } catch (error) {
      console.error(`❌ Error enviando email de verificación a ${email}:`, error);
      throw new Error(`Error enviando email de verificación: ${error.message}`);
    }
  }

  async verifyEmailToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'email-verification') {
        throw new Error('Token inválido para verificación de email');
      }

      return {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      console.error('❌ Error verificando token de email:', error);
      throw new Error('Token de verificación inválido o expirado');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión de email de verificación verificada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión de email de verificación:', error);
      return false;
    }
  }
}


