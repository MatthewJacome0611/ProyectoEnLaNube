# Proyecto en la Nube

Aplicación web para administrar productos de inventario. El frontend estático se publica en GitHub Pages y consume una API REST desplegada en Render con PostgreSQL.

## Aplicación publicada

- **Frontend:** [https://matthewjacome0611.github.io/ProyectoEnLaNube/](https://matthewjacome0611.github.io/ProyectoEnLaNube/)
- **API de productos:** [https://proyectoenlanube.onrender.com/api/v1/productos](https://proyectoenlanube.onrender.com/api/v1/productos)
- **Base de datos:** PostgreSQL administrado por Render

La interfaz permite listar y paginar productos, consultar por ID, crear, reemplazar, actualizar parcialmente y eliminar.

## Estructura

```text
ProyectoEnLaNube/
├── backend/                 # API Node.js, Express y Prisma
│   ├── prisma/              # Esquema y migraciones PostgreSQL
│   └── src/                 # Rutas, controladores y acceso a datos
├── frontend/                # Interfaz estática y servidor para desarrollo local
├── .github/workflows/       # CI, despliegue Render y publicación de Pages
└── README.md
```

## Desarrollo local

### Backend

Requiere Node.js 26.13.0 y una base de datos PostgreSQL accesible.

```powershell
cd backend
npm ci
```

Crea `backend/.env` a partir de `.env.example` y configura `DATABASE_URL` con una URL de PostgreSQL local. Después:

```powershell
npm run db:generate
npm run db:migrate:deploy
npm start
```

Por defecto, la API escucha en `http://localhost:5051/api/v1/productos`.

### Frontend

En otra terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm start
```

La interfaz local queda en `http://localhost:5173`. En localhost usa `API_BASE_URL` del archivo `.env`; en GitHub Pages usa la URL pública declarada en `frontend/config.js`.

## Rutas de la API

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/api/v1/productos` | Lista productos paginados |
| GET | `/api/v1/productos/:id` | Consulta un producto |
| POST | `/api/v1/productos` | Crea un producto |
| PUT | `/api/v1/productos/:id` | Reemplaza todos sus campos |
| PATCH | `/api/v1/productos/:id` | Actualiza campos seleccionados |
| DELETE | `/api/v1/productos/:id` | Elimina un producto |

## CI/CD y configuración

El workflow de GitHub Actions ejecuta instalación limpia, validación y migración Prisma, pruebas de backend y frontend, y análisis de dependencias. En pushes a `main` o `master`, al aprobar CI también solicita el despliegue de Render y publica el frontend en GitHub Pages.

Configura en GitHub el secreto `RENDER_DEPLOY_HOOK_URL`. En el servicio backend de Render establece `DATABASE_URL` usando la URL interna de la base PostgreSQL y el comando previo al despliegue `npm run db:migrate:deploy`. La API debe permitir CORS para el dominio de GitHub Pages.

No guardes credenciales ni la URL de producción de la base de datos en este repositorio. La conexión del navegador a la API es pública y solo debe apuntar al endpoint HTTP de la aplicación.
