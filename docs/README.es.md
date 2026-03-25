<h1 align="center">SHORTURL</h1>

<p align="center">by roldyoran</p>

Acortador de URLs construido con **Hono** sobre **Cloudflare Workers**, **Cloudflare D1** (SQLite serverless) y **Drizzle ORM**. Arquitectura Hexagonal (Ports & Adapters).

---

## Requisitos previos

- [Bun](https://bun.sh) ≥ 1.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) ≥ 4.0 (incluido como devDependency)
- Cuenta de Cloudflare con una base de datos D1 creada

---

## Instalación

```bash
# 1. Clona el repositorio
git clone git@github.com:roldyoran/shorturl.git
cd shorturl

# 2. Instala las dependencias
bun install
```

---

## Configuración

### 1. Variables de entorno (local)

Crea un archivo `.env` en la raíz del proyecto:

```env
SERVICE_ADMIN_API_KEY=tu_api_key_secreta
```

### 2. Wrangler — binding D1

Edita `wrangler.jsonc` y reemplaza el `database_id` con el ID de tu base de datos D1:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "shorturl",
      "database_id": "<tu-database-id>"
    }
  ]
}
```

### 3. Migraciones de base de datos

```bash
# Aplicar migraciones en D1 local (desarrollo)
bun run db:migrate:local

# Aplicar migraciones en D1 remoto (producción)
bun run db:migrate:remote
```

---

## Desarrollo local

```bash
bun dev
```

El servidor arranca en `http://localhost:8787`.

---

## Uso de la API

### Crear una URL corta

```bash
curl -X POST http://localhost:8787/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.epicgames.com"}'
```

```json
{
  "id": 1,
  "originalUrl": "https://www.epicgames.com",
  "shortCode": "c04jzv",
  "createdAt": "2026-03-03T19:02:53.404Z",
  "visits": 0
}
```

### Crear una URL con shortCode personalizado

```bash
curl -X POST http://localhost:8787/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://hono.dev", "shortCode": "hono"}'
```

### Redirigir a la URL original

```bash
curl -L http://localhost:8787/c04jzv
```

Responde con `302 Location: https://www.epicgames.com` e incrementa el contador de visitas.

### Listar todas las URLs

```bash
curl http://localhost:8787/v1/urls
```

### Obtener una URL por shortCode

```bash
curl http://localhost:8787/v1/urls/c04jzv
```

### Eliminar una URL (requiere API key)

```bash
curl -X DELETE http://localhost:8787/v1/admin/urls/c04jzv \
  -H "Authorization: Bearer tu_api_key_secreta"
```

### Eliminar todas las URLs (requiere API key)

```bash
curl -X DELETE http://localhost:8787/v1/admin/urls \
  -H "Authorization: Bearer tu_api_key_secreta"
```

---

## Tests

```bash
bun test                  # todos los tests
bun run test:watch        # modo watch
bun run test:coverage     # con reporte de cobertura
bun run test:bail         # aborta al primer fallo
```

---

## Deploy a Cloudflare Workers

```bash
bun deploy
```

---

## Comandos útiles

```bash
bun format                 # formatea el código con Biome
bun run db:generate        # genera SQL de migración desde el schema
bun run db:studio          # abre Drizzle Studio para inspeccionar la BD
```

---

## Frontend (Vue 3)

El proyecto incluye un frontend simple en Vue 3 para probar la API con una interfaz de usuario agradable.

### Características del Frontend

- **Acortar URLs**: Crea URLs cortas directamente desde la interfaz
- **Gestión de URLs**: Ver, copiar y eliminar tus URLs acortadas
- **Generación de QR**: Genera códigos QR para URLs acortadas
- **Lista Pública de URLs**: Navega por URLs acortadas públicamente
- **Tema Oscuro/Claro**: Cambia entre modo oscuro y claro
- **Diseño Responsivo**: Funciona en escritorio y dispositivos móviles

### Ejecutar el Frontend

```bash
cd frontend
bun dev
```

El frontend corre en `http://localhost:5173` (Vite por defecto).

### Tecnologías del Frontend

- Vue 3 (Composition API)
- Vite
- Pinia (gestión de estado)
- Shadcn-VUE (componentes UI)
- Tailwind CSS
- TypeScript
