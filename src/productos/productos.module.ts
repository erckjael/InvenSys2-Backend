import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity.js';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';

/**
 * Módulo de NestJS para el recurso "Productos".
 *
 * Encapsula todo lo relacionado con productos:
 * - Entidad TypeORM (Producto)
 * - Controlador REST (ProductosController)
 * - Servicio de lógica de negocio (ProductosService)
 *
 * `TypeOrmModule.forFeature([Producto])` registra el repositorio de Producto
 * en el contenedor de DI de este módulo, permitiendo que `ProductosService`
 * lo inyecte con `@InjectRepository(Producto)`.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  // Exportamos el servicio por si otros módulos (ej: pedidos, reportes)
  // necesitan consultar la información de productos en el futuro.
  exports: [ProductosService],
})
export class ProductosModule {}
