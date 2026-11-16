import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

/**
 * DTO (Data Transfer Object) para la creación de un producto.
 *
 * Valida y transforma los datos entrantes del cuerpo de la petición HTTP POST.
 * Las reglas se aplican con el `ValidationPipe` global configurado en main.ts.
 */
export class CreateProductoDto {
  /**
   * Código único del producto (ej: SKU, código de barras).
   * @example "PROD-001"
   */
  @IsString({ message: 'El código debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El código del producto no puede estar vacío.' })
  @MaxLength(100, { message: 'El código no puede superar los 100 caracteres.' })
  codigo: string;

  /**
   * Nombre descriptivo del producto.
   * @example "Camiseta Polo Azul Talla M"
   */
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío.' })
  @MaxLength(255, { message: 'El nombre no puede superar los 255 caracteres.' })
  nombre: string;

  /**
   * Precio de compra del producto. Debe ser positivo.
   * @example 15000.50
   */
  @IsNumber({}, { message: 'El precio de compra debe ser un número.' })
  @IsPositive({ message: 'El precio de compra debe ser un valor positivo.' })
  precioCompra: number;

  /**
   * Precio de venta al público. Debe ser positivo.
   * @example 25000.00
   */
  @IsNumber({}, { message: 'El precio de venta debe ser un número.' })
  @IsPositive({ message: 'El precio de venta debe ser un valor positivo.' })
  precioVenta: number;

  /**
   * Cantidad inicial en inventario. Por defecto 0.
   * @example 100
   */
  @IsOptional()
  @IsInt({ message: 'El stock actual debe ser un número entero.' })
  @Min(0, { message: 'El stock actual no puede ser negativo.' })
  stockActual?: number;

  /**
   * Stock mínimo antes de generar alerta de reposición. Por defecto 0.
   * @example 10
   */
  @IsOptional()
  @IsInt({ message: 'El stock mínimo debe ser un número entero.' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo.' })
  stockMinimo?: number;

  /**
   * ID de la categoría a la que pertenece el producto.
   * @example 3
   */
  @IsOptional()
  @IsInt({ message: 'El ID de la categoría debe ser un número entero.' })
  @IsPositive({ message: 'El ID de la categoría debe ser positivo.' })
  categoriaId?: number;
}
