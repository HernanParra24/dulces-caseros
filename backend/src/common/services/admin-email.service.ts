import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AdminEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar el transporter de Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dulcetwilightdc@gmail.com',
        pass: 'zlhe avfy gmcz msns', // Contraseña de aplicación de Gmail
      },
    });
  }

  async sendNewsletterEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      const mailOptions = {
        from: '"Dulces Caseros" <dulcetwilightdc@gmail.com>',
        to: to,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="color: #e67e22; margin: 0;">🍰 Dulces Caseros</h1>
              <p style="color: #666; margin: 10px 0;">Novedades y actualizaciones</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
              ${content}
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2024 Dulces Caseros. Todos los derechos reservados.
              </p>
              <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">
                Este email fue enviado desde el panel de administración.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error(`❌ Error enviando email a ${to}:`, error);
      throw new Error(`Error enviando email: ${error.message}`);
    }
  }

  async sendBulkNewsletter(emails: string[], subject: string, content: string): Promise<{ success: string[], failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const email of emails) {
      try {
        await this.sendNewsletterEmail(email, subject, content);
        success.push(email);
      } catch (error) {
        console.error(`Error enviando email a ${email}:`, error);
        failed.push(email);
      }
    }

    return { success, failed };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión de email verificada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión de email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, firstName: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: '"Dulces Caseros - Recuperación" <dulcetwilightdc@gmail.com>',
        to: to,
        subject: '🔐 Recupera tu contraseña - Dulces Caseros',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="color: #e67e22; margin: 0;">🍰 Dulces Caseros</h1>
              <p style="color: #666; margin: 10px 0;">Recuperación de contraseña</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333;">¡Hola ${firstName}! 👋</h2>
              <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Dulces Caseros</strong>.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #e67e22; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  🔐 Restablecer Contraseña
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>¿No solicitaste este cambio?</strong><br>
                Si no fuiste tú quien solicitó este cambio, puedes ignorar este email de forma segura.
              </p>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>¿No funciona el botón?</strong><br>
                Copia y pega este enlace en tu navegador:<br>
                <a href="${resetUrl}" style="color: #e67e22; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2024 Dulces Caseros. Todos los derechos reservados.
              </p>
              <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">
                Este email fue enviado para recuperar tu contraseña.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de recuperación de contraseña enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error(`❌ Error enviando email de recuperación de contraseña a ${to}:`, error);
      throw new Error(`Error enviando email de recuperación: ${error.message}`);
    }
  }

  async sendContactResponseEmail(to: string, nombre: string, asunto: string, respuesta: string): Promise<void> {
    try {
      const mailOptions = {
        from: '"Dulces Caseros - Soporte" <dulcetwilightdc@gmail.com>',
        to: to,
        subject: `Re: ${asunto} - Respuesta de Dulces Caseros`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="color: #e67e22; margin: 0;">🍰 Dulces Caseros</h1>
              <p style="color: #666; margin: 10px 0;">Respuesta a tu consulta</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333;">¡Hola ${nombre}! 👋</h2>
              <p>Hemos recibido tu mensaje sobre: <strong>"${asunto}"</strong></p>
              
              <div style="background-color: #f0f8ff; border-left: 4px solid #e67e22; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h3 style="color: #e67e22; margin-top: 0;">Nuestra respuesta:</h3>
                <div style="white-space: pre-wrap; color: #333; line-height: 1.6;">
                  ${respuesta}
                </div>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Si tienes alguna pregunta adicional, no dudes en contactarnos nuevamente.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/contacto" 
                   style="background-color: #e67e22; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  📧 Contactar nuevamente
                </a>
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                © 2024 Dulces Caseros. Todos los derechos reservados.
              </p>
              <p style="color: #999; margin: 5px 0 0 0; font-size: 12px;">
                Este email es una respuesta automática a tu consulta de contacto.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de respuesta de contacto enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error(`❌ Error enviando email de respuesta de contacto a ${to}:`, error);
      throw new Error(`Error enviando email de respuesta: ${error.message}`);
    }
  }
}
