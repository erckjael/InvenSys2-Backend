import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './categoria.entity.js';

/**
 * Módulo de NestJS para el recurso "Categorías".
 *
 * Por ahora actúa como módulo de infraestructura: registra la entidad
 * en TypeORM para que las relaciones con Producto funcionen correctamente.
 *
 * En el futuro se puede expandir con su propio Controlador y Servicio
 * para gestionar categorías via API REST.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  exports: [TypeOrmModule],
})
export class CategoriasModule {}
