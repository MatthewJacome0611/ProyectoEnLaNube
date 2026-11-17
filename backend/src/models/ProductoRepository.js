import { Database } from '../config/Database.js';
import { Product } from './ProductoModel.js';

export class ProductRepository {
  static #instance = null;

  constructor() {
    if (ProductRepository.#instance) {
      return ProductRepository.#instance;
    }

    this.db = null;
    ProductRepository.#instance = this;
  }

  static getInstance() {
    if (!ProductRepository.#instance) {
      return new ProductRepository();
    }
    return ProductRepository.#instance;
  }

  #resolveDb() {
    if (!this.db) {
      this.db = Database.getInstance().getClient();
    }
    return this.db;
  }

  #toProduct(row) {
    return new Product(row.id, row.nombre, row.categoria, row.pvp);
  }

  async countAll() {
    const db = this.#resolveDb();
    return db.producto.count();
  }

  async findPaginated(limit, offset) {
    const db = this.#resolveDb();
    const rows = await db.producto.findMany({
      orderBy: { id: 'asc' },
      skip: Number(offset),
      take: Number(limit)
    });
    return rows.map((row) => this.#toProduct(row));
  }

  async findById(id) {
    const db = this.#resolveDb();
    const row = await db.producto.findUnique({ where: { id: Number(id) } });
    return row ? this.#toProduct(row) : null;
  }

  async create(productData) {
    const db = this.#resolveDb();
    const row = await db.producto.create({ data: productData });
    return this.#toProduct(row);
  }

  async update(id, updateData) {
    const db = this.#resolveDb();
    await db.producto.updateMany({ where: { id: Number(id) }, data: updateData });
    return this.findById(id);
  }

  async patch(id, partialData) {
    const db = this.#resolveDb();
    if (Object.keys(partialData).length === 0) {
      return this.findById(id);
    }

    await db.producto.updateMany({ where: { id: Number(id) }, data: partialData });
    return this.findById(id);
  }

  async delete(id) {
    const db = this.#resolveDb();
    const result = await db.producto.deleteMany({ where: { id: Number(id) } });
    return result.count > 0;
  }
}

export { ProductRepository as ProductoRepository };
