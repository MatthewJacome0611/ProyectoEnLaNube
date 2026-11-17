import 'dotenv/config';

const readInteger = (name, fallback, minimum = 1) => {
  const rawValue = process.env[name];
  if (rawValue === undefined || rawValue.trim() === '') {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new Error(`La variable ${name} debe ser un entero mayor o igual a ${minimum}.`);
  }

  return value;
};

const readList = (name, fallback) => {
  const rawValue = process.env[name];
  if (rawValue === undefined) {
    return fallback;
  }

  const values = rawValue.split(',').map((value) => value.trim()).filter(Boolean);
  if (values.length === 0) {
    throw new Error(`La variable ${name} debe contener al menos un valor.`);
  }

  return values;
};

const apiProductsPath = process.env.API_PRODUCTS_PATH || '/api/v1/productos';
if (!apiProductsPath.startsWith('/') || apiProductsPath.includes('?') || apiProductsPath.includes('#')) {
  throw new Error('La variable API_PRODUCTS_PATH debe ser una ruta absoluta, por ejemplo /api/v1/productos.');
}

export const settings = Object.freeze({
  port: readInteger('PORT', 5051),
  apiProductsPath,
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || '100kb',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  corsMethods: readList('CORS_METHODS', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']).join(', '),
  corsAllowedHeaders: readList(
    'CORS_ALLOWED_HEADERS',
    ['Content-Type', 'Authorization', 'X-Requested-With']
  ).join(', '),
  paginationLimit: readInteger('PAGINATION_LIMIT', 100),
  database: {
    url: process.env.DATABASE_URL
  }
});
