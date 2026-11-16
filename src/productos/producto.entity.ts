import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity.js';

/**
 * Entidad TypeORM que mapea la tabla `productos` en la base de datos.
 *
 * Relaciones:
 * - ManyToOne con `Categoria`: Un producto pertenece a una categoría.
 */
@Entity({ name: 'productos' })
export class Producto {
  /** Clave primaria auto-incremental */
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  idProducto: number;

  /**
   * Código único de identificación del producto (ej: SKU, barcode).
   * Se usa un índice único para garantizar la integridad de datos.
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  codigo: string;

  /** Nombre descriptivo del producto */
  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  /**
   * Precio de compra (costo) del producto.
   * Se usa DECIMAL(10,2) para evitar errores de punto flotante en dinero.
   */
  @Column({
    name: 'precio_compra',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioCompra: number;

  /** Precio de venta al público del producto */
  @Column({
    name: 'precio_venta',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  precioVenta: number;

  /** Cantidad actual en inventario */
  @Column({ name: 'stock_actual', type: 'int', default: 0 })
  stockActual: number;

  /**
   * Stock mínimo permitido.
   * Cuando stockActual <= stockMinimo, se debe generar una alerta.
   */
  @Column({ name: 'stock_minimo', type: 'int', default: 0 })
  stockMinimo: number;

  // ─── Relación con Categorías ─────────────────────────────────────────────

  /**
   * Relación ManyToOne: Muchos productos → Una categoría.
   *
   * @JoinColumn le indica a TypeORM el nombre de la columna FK en la tabla.
   * TypeORM infiere el tipo directamente desde la PK de Categoria (INT),
   * evitando cualquier conflicto de tipos incompatibles.
   * No se necesita un @Column() separado para categoria_id.
   */
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  // ─── Metadatos de Auditoría ──────────────────────────────────────────────

  /** Fecha y hora de creación del registro (se gestiona automáticamente) */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** Fecha y hora de última actualización (se gestiona automáticamente) */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
