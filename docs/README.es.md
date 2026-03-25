<h1 align="center">CUBEPATH.SHORTURL</h1>

<p align="center">by roldyoran</p>

Acortador de URLs construido con **Hono**, **PostgreSQL** y **Drizzle ORM**. Arquitectura Hexagonal (Ports & Adapters). Despliegue con Docker.

---

## Requisitos previos

- [Bun](https://bun.sh) ≥ 1.0
- [Docker](https://www.docker.com/) y Docker Compose

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/roldyoran/cubepath.shorturl.git
cd cubepath.shorturl

# 2. Instala las dependencias
bun install
```

---

## Configuración

Crea un archivo `.env` en la carpeta `backend/`:

```env
SERVICE_ADMIN_API_KEY=tu_api_key_secreta
```

---

## Inicio rápido (Docker)

```bash
# Iniciar todos los servicios (PostgreSQL + Backend)
docker-compose up -d
```

La API del backend inicia en `http://localhost:5044`.

---

## Desarrollo local (Sin Docker)

### 1. Iniciar PostgreSQL

```bash
# Usando Docker solo para la base de datos
docker run -d \
  --name shorturl-db \
  -e POSTGRES_USER=shorturl \
  -e POSTGRES_PASSWORD=shorturl \
  -e POSTGRES_DB=shorturl \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Ejecutar migraciones de base de datos

```bash
cd backend
bun run db:push
```

### 3. Iniciar el Backend

```bash
bun run dev
```

El servidor arranca en `http://localhost:5044`.

---

## Uso de la API

### Crear una URL corta

```bash
curl -X POST http://localhost:5044/v1/urls \
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
curl -X POST http://localhost:5044/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://hono.dev", "shortCode": "hono"}'
```

### Redirigir a la URL original

```bash
curl -L http://localhost:5044/c04jzv
```

Responde con `302 Location: https://www.epicgames.com` e incrementa el contador de visitas.

### Listar todas las URLs

```bash
curl http://localhost:5044/v1/urls
```

### Obtener una URL por shortCode

```bash
curl http://localhost:5044/v1/urls/c04jzv
```

### Eliminar una URL (requiere API key)

```bash
curl -X DELETE http://localhost:5044/v1/admin/urls/c04jzv \
  -H "Authorization: Bearer tu_api_key_secreta"
```

### Eliminar todas las URLs (requiere API key)

```bash
curl -X DELETE http://localhost:5044/v1/admin/urls \
  -H "Authorization: Bearer tu_api_key_secreta"
```

---

## Tests

```bash
cd backend
bun test                  # todos los tests
bun run test:watch        # modo watch
```

---

## Tecnologías

### Backend

- [Bun](https://bun.sh) - Runtime de JavaScript
- [Hono](https://hono.dev) - Framework web
- [PostgreSQL](https://www.postgresql.org/) - Base de datos
- [Drizzle ORM](https://orm.drizzle.team/) - ORM
- [Docker](https://www.docker.com/) - Contenedores

### Frontend

- Vue 3 (Composition API)
- Vite
- Pinia (gestión de estado)
- Shadcn-VUE (componentes UI)
- Tailwind CSS
- TypeScript

---

## Comandos útiles

```bash
# Desarrollo
bun run dev:front        # iniciar frontend
bun run dev:back         # iniciar backend

# Build
bun run build:front      # build del frontend
bun run build:back       # build del backend

# Formato
bun run format:front     # formatea frontend con Biome
cd backend && bun run format  # formatea backend con Biome
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
bun run dev:front
```

El frontend corre en `http://localhost:5173` (Vite por defecto).