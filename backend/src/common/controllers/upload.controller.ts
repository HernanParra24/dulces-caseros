import { Controller, Post, Get, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CloudinaryService } from '../services/cloudinary.service';
import * as multer from 'multer';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      // Validar tipo de archivo
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp|svg\+xml)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp, svg)'), false);
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return cb(new BadRequestException('El archivo es demasiado grande. Máximo 5MB'), false);
      }
      
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    console.log('Archivo recibido:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer ? 'Buffer presente' : 'Sin buffer'
    });

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      
      return {
        success: true,
        url: imageUrl,
        message: 'Imagen subida exitosamente',
      };
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw new BadRequestException('Error al subir la imagen: ' + error.message);
    }
  }

  @Get('test')
  @Roles(UserRole.ADMIN)
  test() {
    return { message: 'Upload endpoint funcionando correctamente' };
  }
}
