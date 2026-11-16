import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto.js';

/**
 * DTO para la actualización parcial de un producto.
 *
 * Extiende `CreateProductoDto` usando `PartialType`, lo que hace que
 * todos los campos sean opcionales automáticamente, cumpliendo con la
 * semántica del método HTTP PATCH (actualización parcial).
 *
 * No es necesario re-declarar las validaciones; se heredan de CreateProductoDto.
 */
export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  // PartialType genera automáticamente todos los campos de CreateProductoDto
  // como opcionales. TypeScript reconoce todos los campos heredados en tiempo de ejecución,
  // pero para evitar errores de tipo en strict mode, los redeclaramos como opcionales.
  codigo?: string;
  nombre?: string;
  precioCompra?: number;
  precioVenta?: number;
  stockActual?: number;
  stockMinimo?: number;
  categoriaId?: number;
}
