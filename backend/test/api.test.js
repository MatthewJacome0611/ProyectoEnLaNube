import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import { settings } from '../src/config/settings.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('el backend no sirve la interfaz gráfica ni la configuración del frontend', async () => {
  const response = await fetch(`${baseUrl}/`);
  const configResponse = await fetch(`${baseUrl}/app-config.json`);

  assert.equal(response.status, 404);
  assert.equal((await response.json()).statusCode, 404);
  assert.equal(configResponse.status, 404);
});

test('preflight CORS termina con 204', async () => {
  const response = await fetch(`${baseUrl}${settings.apiProductsPath}`, {
    method: 'OPTIONS',
    headers: { Origin: 'http://localhost:5173' }
  });

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});

test('rechaza productos sin los campos requeridos antes de acceder a la base de datos', async () => {
  const response = await fetch(`${baseUrl}${settings.apiProductsPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'Teclado' })
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /categoria/);
});

test('rechaza precios negativos y adjunta el hash de respuesta', async () => {
  const response = await fetch(`${baseUrl}${settings.apiProductsPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: 'Teclado', categoria: 'Accesorios', pvp: -1 })
  });

  assert.equal(response.status, 400);
  assert.ok(response.headers.get('etag'));
  assert.ok(response.headers.get('x-content-hash'));
  assert.match((await response.json()).message, /pvp/);
});

test('rechaza valores no numéricos para el precio', async () => {
  for (const pvp of [null, false, '']) {
    const response = await fetch(`${baseUrl}${settings.apiProductsPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Teclado', categoria: 'Accesorios', pvp })
    });

    assert.equal(response.status, 400);
    assert.match((await response.json()).message, /pvp/);
  }
});

test('rechaza IDs que no sean enteros positivos', async () => {
  const response = await fetch(`${baseUrl}${settings.apiProductsPath}/abc`);

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /entero positivo/);
});

test('completa el CRUD de productos en PostgreSQL', {
  skip: !process.env.DATABASE_URL
}, async () => {
  const product = {
    nombre: `Producto de prueba ${Date.now()}`,
    categoria: 'Integracion',
    pvp: 12.34
  };
  let productId;

  try {
    const createResponse = await fetch(`${baseUrl}${settings.apiProductsPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    assert.equal(createResponse.status, 201);
    const created = await createResponse.json();
    productId = created.data.id;

    const readResponse = await fetch(`${baseUrl}${settings.apiProductsPath}/${productId}`);
    assert.equal(readResponse.status, 200);
    assert.equal((await readResponse.json()).data.nombre, product.nombre);

    const updateResponse = await fetch(`${baseUrl}${settings.apiProductsPath}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, nombre: `${product.nombre} actualizado`, pvp: 20.5 })
    });
    assert.equal(updateResponse.status, 200);

    const patchResponse = await fetch(`${baseUrl}${settings.apiProductsPath}/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pvp: 25.75 })
    });
    assert.equal(patchResponse.status, 200);
    assert.equal((await patchResponse.json()).data.pvp, 25.75);

    const listResponse = await fetch(`${baseUrl}${settings.apiProductsPath}`);
    assert.ok([200, 206].includes(listResponse.status));
    assert.ok((await listResponse.json()).data.some(({ id }) => id === productId));

    const deleteResponse = await fetch(`${baseUrl}${settings.apiProductsPath}/${productId}`, {
      method: 'DELETE'
    });
    assert.equal(deleteResponse.status, 204);
    productId = undefined;
  } finally {
    if (productId !== undefined) {
      await fetch(`${baseUrl}${settings.apiProductsPath}/${productId}`, { method: 'DELETE' });
    }
  }
});
