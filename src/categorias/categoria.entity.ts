import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Producto } from '../productos/producto.entity.js';

/**
 * Entidad TypeORM que mapea la tabla `categorias` en la base de datos.
 *
 * Relaciones:
 * - OneToMany con `Producto`: Una categoría puede tener muchos productos.
 */
@Entity({ name: 'categorias' })
export class Categoria {
  /** Clave primaria auto-incremental */
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  idCategoria: number;

  /** Nombre de la categoría (ej: "Electrónica", "Ropa", "Alimentos") */
  @Column({ name: 'nombre_categoria', type: 'varchar', length: 150, unique: true })
  nombreCategoria: string;

  /**
   * Relación inversa: Una categoría tiene muchos productos.
   * Se declara aquí para completar la relación bidireccional con `Producto`.
   */
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
