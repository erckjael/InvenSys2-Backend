import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';

/**
 * Módulo raíz de la aplicación InvenSys2.
 *
 * Responsabilidades:
 * - Cargar variables de entorno de forma global (ConfigModule).
 * - Establecer la conexión a la base de datos MySQL via TypeORM.
 * - Registrar los módulos de cada recurso (ProductosModule, etc.).
 */
@Module({
  imports: [
    // ─── Variables de Entorno ────────────────────────────────────────────────
    // isGlobal: true permite acceder a ConfigService en cualquier módulo
    // sin necesidad de re-importarlo.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Conexión a MySQL con TypeORM ─────────────────────────────────────────
    // TypeOrmModule.forRootAsync permite inyectar ConfigService para leer
    // las credenciales desde las variables de entorno de forma asíncrona y segura.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'invensys2'),

        // Detecta automáticamente las entidades en la carpeta dist/
        // para no tener que registrarlas manualmente en este archivo.
        autoLoadEntities: true,

        // ADVERTENCIA: 'synchronize: true' solo para desarrollo.
        // En producción, usa migraciones de TypeORM para evitar pérdida de datos.
        synchronize: configService.get<string>('NODE_ENV') !== 'production',

        // Configuración del pool de conexiones
        extra: {
          connectionLimit: 10,
        },
      }),
    }),

    // ─── Módulos de Recursos ──────────────────────────────────────────────────
    ProductosModule,
    CategoriasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
