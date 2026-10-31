import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { configureApp } from './setup';

// Punto de entrada para Vercel: la app Nest se crea una sola vez por instancia y se reutiliza entre requests
let server: Promise<express.Express> | undefined;

async function createServer(): Promise<express.Express> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn', 'log'],
  });
  configureApp(app);
  await app.init();
  return expressApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  if (!server) {
    server = createServer().catch((err) => {
      server = undefined;
      throw err;
    });
  }
  const app = await server;
  return app(req, res);
}
