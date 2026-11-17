import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { settings } from './settings.js';

export class Database {
  static #instance = null;
  #prisma;

  constructor() {
    if (Database.#instance) {
      return Database.#instance;
    }

    if (!settings.database.url) {
      throw new Error('La variable de entorno DATABASE_URL es obligatoria para conectar con PostgreSQL.');
    }

    const adapter = new PrismaPg({ connectionString: settings.database.url });
    this.#prisma = new PrismaClient({ adapter });

    Database.#instance = this;
  }

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  getClient() {
    return this.#prisma;
  }

  async testConnection() {
    try {
      await this.#prisma.$connect();
      await this.#prisma.$queryRaw`SELECT 1`;
      console.log('[Base de datos] Conexión Prisma establecida con éxito.');
    } catch (error) {
      console.error('[Base de datos] No se pudo establecer la conexión:', error.message);
      throw error;
    }
  }
}
