import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

/**
 * Punto de entrada de la aplicación InvenSys2.
 *
 * Configuración global aplicada aquí:
 * - ValidationPipe: Valida automáticamente todos los DTOs en cada endpoint.
 * - CORS: Habilitado para desarrollo (restringir en producción).
 * - Prefijo global '/api': Todas las rutas son accesibles bajo /api/...
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── Validación Global de DTOs ───────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      // Elimina propiedades no declaradas en el DTO (seguridad contra mass-assignment)
      whitelist: true,
      // Lanza error 400 si se envían propiedades no permitidas en el DTO
      forbidNonWhitelisted: true,
      // Convierte tipos primitivos automáticamente (ej: "3" → 3 para @IsNumber)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── CORS ────────────────────────────────────────────────────────────────
  // TODO: En producción, restringir 'origin' al dominio del frontend.
  app.enableCors();

  // ─── Prefijo Global de la API ─────────────────────────────────────────────
  // Todas las rutas serán accesibles bajo: http://localhost:PORT/api/...
  app.setGlobalPrefix('api');

  // ─── Puerto de Escucha ────────────────────────────────────────────────────
  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 InvenSys2 corriendo en: http://localhost:${port}/api`);
}

await bootstrap();
