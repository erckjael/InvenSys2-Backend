import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Producto } from './producto.entity.js';

/**
 * Controlador REST para el recurso "Productos".
 *
 * Ruta base: /productos
 *
 * Endpoints disponibles:
 * - GET    /productos          → Listar todos los productos
 * - GET    /productos/:id      → Obtener un producto por ID
 * - POST   /productos          → Crear un nuevo producto
 * - PATCH  /productos/:id      → Actualizar parcialmente un producto
 * - DELETE /productos/:id      → Eliminar un producto
 *
 * El controlador delega toda la lógica de negocio al `ProductosService`.
 * Su responsabilidad es únicamente manejar la capa HTTP (parsing, validación de ruta, respuesta).
 */
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // ─── POST /productos ──────────────────────────────────────────────────────

  /**
   * Crea un nuevo producto.
   *
   * Responde con HTTP 201 Created al crear exitosamente.
   * El cuerpo es validado automáticamente por el ValidationPipe global.
   *
   * @param createProductoDto - Datos del nuevo producto.
   * @returns El objeto del producto recién creado con su ID.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    return this.productosService.create(createProductoDto);
  }

  // ─── GET /productos ───────────────────────────────────────────────────────

  /**
   * Obtiene el listado completo de todos los productos con su categoría.
   *
   * @returns Array de productos ordenados alfabéticamente.
   */
  @Get()
  findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  // ─── GET /productos/:id ───────────────────────────────────────────────────

  /**
   * Obtiene un único producto por su ID.
   *
   * `ParseIntPipe` valida y transforma el parámetro `:id` de string a número.
   * Si el ID no es un número válido, responde automáticamente con HTTP 400.
   * Si el producto no existe, el servicio lanza HTTP 404.
   *
   * @param id - ID numérico del producto (extraído de la URL).
   * @returns El producto encontrado con su categoría.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return this.productosService.findOne(id);
  }

  // ─── PATCH /productos/:id ─────────────────────────────────────────────────

  /**
   * Actualiza parcialmente un producto existente (HTTP PATCH).
   *
   * Solo se actualizan los campos presentes en el cuerpo de la petición.
   * Los campos omitidos conservan su valor actual en la base de datos.
   *
   * @param id - ID del producto a actualizar.
   * @param updateProductoDto - Campos a actualizar (todos son opcionales).
   * @returns El producto con los datos actualizados.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.productosService.update(id, updateProductoDto);
  }

  // ─── DELETE /productos/:id ────────────────────────────────────────────────

  /**
   * Elimina un producto de forma permanente.
   *
   * Responde con HTTP 200 OK y un mensaje de confirmación.
   * Si el producto no existe, el servicio lanza HTTP 404.
   *
   * @param id - ID del producto a eliminar.
   * @returns Objeto con mensaje de confirmación.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.productosService.remove(id);
  }
}
