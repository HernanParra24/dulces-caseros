import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as express from 'express';

// Configuración común para el servidor local (main.ts) y la función serverless de Vercel (serverless.ts)
export function configureApp(app: INestApplication) {
  // Configuración de límites de payload para imágenes
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Configuración de CORS corregida para aceptar cualquier origen y evitar bloqueos
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
