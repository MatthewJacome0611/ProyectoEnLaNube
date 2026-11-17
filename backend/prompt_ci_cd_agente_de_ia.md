# Prompt de Configuración y Ejecución de CI/CD para Agente de IA

Actúa como un Ingeniero DevOps y Arquitecto de Software experto. Tu objetivo es configurar, supervisar y ejecutar el flujo de Integración Continua y Despliegue Continuo (CI/CD) para el proyecto backend alojado en el repositorio de GitHub: `https://github.com/MatthewJacome0611/ProyectoEnLaNube.git`.

## Contexto y Tecnologías del Proyecto
* **Entorno de Ejecución:** Node.js v26.13.0
* **Framework Web:** Express v4.22.3
* **Base de Datos:** PostgreSQL en Render (conecta mediante `DATABASE_URL` como variable de entorno segura)
* **Plataforma de Despliegue:** Render

---

## Fases del Flujo CI/CD a Ejecutar en GitHub Actions

El pipeline debe dispararse automáticamente ante eventos en la rama principal (`main` o `master`) y constar de las siguientes etapas secuenciales:

### 1. Migración y Preparación del Repositorio
* Asegurar que todo el código fuente del backend esté correctamente estructurado y versionado en el repositorio `https://github.com/MatthewJacome0611/ProyectoEnLaNube.git`.
* Configurar el archivo de dependencias (`package.json`) fijando las versiones correctas de Node.js y Express.

### 2. Pruebas y Validación de la API (CI Pipeline)
* **Instalación de Dependencias:** Ejecutar `npm ci` utilizando Node.js v26.13.0.
* **Pruebas de API (Unitarias e Integración):** Ejecutar el conjunto de pruebas automatizadas (ej. Jest, Mocha, Supertest) para validar los endpoints y la lógica de negocio.
* **Validación de Contrato/Esquema:** Verificar que las respuestas de la API cumplan con los estándares definidos.

### 3. Seguridad de la API (Security Scanning)
* **Análisis de Vulnerabilidades:** Ejecutar escaneos de dependencias (`npm audit` o herramientas estáticas como Snyk / Trivy) para detectar vulnerabilidades en los paquetes de Node.js.
* **Análisis de Código Estático (SAST):** Revisar malas prácticas de seguridad (inyección SQL, manejo inadecuado de secretos, etc.).

### 4. Versionamiento de Paquetes
* Gestionar el versionamiento semántico de los paquetes o verificar la integridad del versionamiento actual en el `package.json` previo al despliegue.

### 5. Despliegue Continuo a Render (CD Pipeline)
* **Condición de Éxito:** Esta fase **solo** debe ejecutarse si **todas** las pruebas anteriores (API, Validación, Seguridad y Versionamiento) finalizan con estado `OK`.
* **Despliegue:** Disponer la aplicación en la plataforma **Render**, asegurando la correcta inyección de `DATABASE_URL` para conectar con PostgreSQL.

---

## Instrucciones para el Agente
Por favor, genera o valida el archivo YAML correspondiente para GitHub Actions (`.github/workflows/ci-cd.yml`) que cumpla estrictamente con este flujo, indicando además cualquier secreto o configuración adicional que debamos registrar en GitHub y en Render.