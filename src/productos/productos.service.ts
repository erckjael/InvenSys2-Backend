import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

/**
 * Servicio que encapsula toda la lógica de negocio para la gestión de productos.
 *
 * Patrón Repository: Las operaciones de base de datos se delegan al repositorio
 * de TypeORM, manteniendo el servicio enfocado en la lógica de la aplicación.
 */
@Injectable()
export class ProductosService {
  /** Logger dedicado para este servicio, facilita el rastreo de errores */
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    /** Repositorio TypeORM inyectado para la entidad Producto */
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  // ─── CREATE ───────────────────────────────────────────────────────────────

  /**
   * Crea un nuevo producto en la base de datos.
   *
   * @param createProductoDto - Datos validados del producto a crear.
   * @returns El producto recién creado con su ID asignado.
   * @throws ConflictException Si ya existe un producto con el mismo código.
   */
  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Verificar si ya existe un producto con ese código (evitar duplicados)
    const existente = await this.productosRepository.findOne({
      where: { codigo: createProductoDto.codigo },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe un producto con el código "${createProductoDto.codigo}".`,
      );
    }

    try {
      // Crear la instancia de la entidad con los datos del DTO
      const nuevoProducto = this.productosRepository.create(createProductoDto);

      // Persistir en la base de datos y retornar el registro creado
      return await this.productosRepository.save(nuevoProducto);
    } catch (error) {
      this.logger.error('Error al crear producto', error);
      throw new InternalServerErrorException('Error interno al crear el producto.');
    }
  }

  // ─── READ (ALL) ───────────────────────────────────────────────────────────

  /**
   * Obtiene el listado completo de todos los productos.
   * Incluye la relación con `categoria` para mostrar el nombre de la categoría.
   *
   * @returns Array de productos. Si no hay productos, retorna un array vacío.
   */
  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: { categoria: true },
      order: { nombre: 'ASC' },
    });
  }

  // ─── READ (ONE) ───────────────────────────────────────────────────────────

  /**
   * Busca y retorna un único producto por su ID.
   *
   * @param id - ID del producto a buscar.
   * @returns El producto encontrado con su categoría.
   * @throws NotFoundException Si no existe ningún producto con ese ID.
   */
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { idProducto: id },
      relations: { categoria: true },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }

    return producto;
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────

  /**
   * Actualiza parcialmente un producto existente.
   * Solo se modifican los campos incluidos en el DTO (semántica PATCH).
   *
   * @param id - ID del producto a actualizar.
   * @param updateProductoDto - Campos a actualizar (todos son opcionales).
   * @returns El producto actualizado.
   * @throws NotFoundException Si no existe ningún producto con ese ID.
   * @throws ConflictException Si el nuevo código ya lo usa otro producto.
   */
  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    // Verificar existencia del producto antes de actualizar
    const producto = await this.findOne(id);

    // Si se está cambiando el código, verificar que no esté duplicado
    if (updateProductoDto.codigo && updateProductoDto.codigo !== producto.codigo) {
      const productoConMismoCodigo = await this.productosRepository.findOne({
        where: { codigo: updateProductoDto.codigo },
      });

      if (productoConMismoCodigo) {
        throw new ConflictException(
          `El código "${updateProductoDto.codigo}" ya está en uso por otro producto.`,
        );
      }
    }

    try {
      // Mezclar los datos del DTO sobre la entidad existente
      const productoActualizado = this.productosRepository.merge(producto, updateProductoDto);
      return await this.productosRepository.save(productoActualizado);
    } catch (error) {
      this.logger.error(`Error al actualizar producto ID ${id}`, error);
      throw new InternalServerErrorException('Error interno al actualizar el producto.');
    }
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────

  /**
   * Elimina un producto de la base de datos de forma permanente.
   *
   * @param id - ID del producto a eliminar.
   * @returns Un objeto con un mensaje de confirmación.
   * @throws NotFoundException Si no existe ningún producto con ese ID.
   */
  async remove(id: number): Promise<{ message: string }> {
    // Verificar existencia antes de eliminar (findOne ya lanza NotFoundException)
    await this.findOne(id);

    await this.productosRepository.delete(id);

    return { message: `Producto con ID ${id} eliminado exitosamente.` };
  }
}
