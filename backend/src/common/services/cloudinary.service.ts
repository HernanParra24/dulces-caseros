import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

@Injectable()
export class CloudinaryService {
  private storage: CloudinaryStorage;

  constructor() {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: 'dvmg30upu',
      api_key: '127969499813155',
      api_secret: '24iDR2jxhIyXZfQG3YjB-WTRR9w', // Reemplaza con tu API Secret real
    });

    // Configurar almacenamiento
    this.storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'dulce-twilight',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
        ],
      } as any,
    });
  }

  // Obtener el middleware de multer configurado
  getUploadMiddleware() {
    return multer({ storage: this.storage });
  }

  // Subir imagen y obtener URL
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Convertir el buffer a base64 para subir directamente
      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'dulce-twilight',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
        ],
      });
      
      return result.secure_url;
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw new Error('Error al subir la imagen');
    }
  }

  // Eliminar imagen de Cloudinary
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error eliminando imagen de Cloudinary:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  // Obtener public ID desde URL
  getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `dulce-twilight/${filename.split('.')[0]}`;
  }

  // Generar URL optimizada para diferentes tamaños
  generateOptimizedUrl(originalUrl: string, width: number, height: number): string {
    const publicId = this.getPublicIdFromUrl(originalUrl);
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
    });
  }
}
