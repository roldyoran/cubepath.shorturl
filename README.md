<h1 align="center">CUBEPATH.SHORTURL</h1>

<p align="center">by roldyoran</p>

> **English**: [Documentation in English](./docs/README.md)

> **Nota**: Este repositorio se enfoca principalmente en el **backend** (API de acortador de URLs). El frontend es una aplicación simple en Vue 3 usada para probar la API con una interfaz de usuario agradable, pero no es el enfoque principal del proyecto.

---

## Descripción

CubePath.ShortURL es un acortador de URLs construido con tecnologías modernas. Te permite crear URLs cortas y fáciles de recordar que redirigen a otras más largas. El proyecto consiste en:

- **Backend**: Una API REST construida con Hono, TypeScript y Bun
- **Frontend**: Una aplicación Vue 3 con una interfaz de usuario amigable

### Demo en vivo

- **API Backend**: http://cubepathshorturl-zyojcm-c8fd35-144-225-147-24.traefik.me/
- **Frontend**: http://cubepathshorturl-zyojcm-6e7ba3-144-225-147-24.traefik.me/

### Capturas de pantalla

![Backend API](./docs/screenshots/backend-demo.png)

![Frontend](./docs/screenshots/frontend-demo-dark.png)

### Documentación de la API

El backend incluye documentación interactiva de la API usando el estándar OpenAPI:

- **Swagger UI** (`/docs`): Interfaz clásica para explorar y probar los endpoints de la API. Incluye información sobre todos los endpoints, parámetros, respuestas y permite realizar pruebas directas desde el navegador.

- **Scalar** (`/scalar`): Documentación moderna y elegante para la API. Ofrece una experiencia más refinada con ejemplos de código en múltiples lenguajes (cURL, Node.js, Python, PHP, Ruby), para probar solicitudes directamente y una UI adaptada a dispositivos móviles.

![Swagger UI](./docs/screenshots/backend-docs-swagger.png)

![Scalar](./docs/screenshots/backend-docs-scalar.png)

---

## Despliegue con CubePath

Este proyecto está desplegado en **CubePath** usando una VPS **gp.nano** con **Dokploy** y **Docker Compose** para un despliegue sencillo y eficiente.

### ¿Qué es CubePath?

CubePath es un proveedor de infraestructura tecnológica y centros de datos propios con ubicaciones estratégicas en Europa (Barcelona, Ámsterdam) y Estados Unidos (Virginia, Miami, Houston). Se enfoca en ofrecer baja latencia y alta conectividad para aplicaciones, controlando el enrutamiento del tráfico y la ubicación física de los sistemas para mejorar el rendimiento.

### ¿Por qué Dokploy?

[Dokploy](https://dokploy.com/) es un PaaS autohospedado que hace el despliegue simple. Proporciona:

- Gestión fácil de aplicaciones via interfaz web
- Orquestación automática de contenedores Docker
- Soporte integrado para Traefik como proxy inverso
- Certificados SSL automáticos con Let's Encrypt
- Gestión simple de bases de datos

### Pasos de despliegue

1. **Deploy 1-Click desde CubePath Marketplace**: La forma más sencilla es usar el **Marketplace de CubePath** para desplegar **Dokploy** con un solo click:
   - Ve a [CubePath Marketplace - Dokploy](https://cubepath.com/marketplace/dokploy)
   - Haz clic en **Deploy Now**
   - Selecciona tu VPS (gp.nano o mayor)
   - ¡Listo! Dokploy se instalará automáticamente en tu VPS

   ![CubePath Marketplace - Dokploy](./docs/screenshots/cubepath-dokploy-marketplace.png)

   También puedes ver el dashboard de CubePath con tus apps desplegadas:

   ![CubePath Dashboard - One Click App](./docs/screenshots/cubepath-dashboard-one-click-app.png)

2. **Configura Traefik**: Dokploy configura automáticamente Traefik como proxy inverso con SSL automático

3. **Despliega la aplicación**: Via la interfaz web de Dokploy:
   - Crea un nuevo proyecto
   - Añade el servicio backend (API Hono)
   - Añade el servicio frontend (Vue 3)
   - Configura las variables de entorno
   - Configura dominios y certificados SSL

   O usando el `docker-compose.yml` proporcionado en este proyecto

### Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                      CubePath VPS (gp.nano)                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Traefik (Proxy Inverso)           │  │
│  │         (SSL automático, Enrutamiento de dominios)   │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                        │                                   │
│          ┌─────────────┴──────────────┐                    │
│          │                            │                    │
│   ┌──────▼──────┐              ┌──────▼──────┐             │
│   │   Backend   │              │   Frontend  │             │
│   │  (Hono.js)  │              │   (Vue 3)   │             │
│   └──────┬──────┘              └─────────────┘             │
│          │                                                 │
│   ┌──────▼──────┐                                          │
│   │ PostgreSQL  │                                          │
│   │  (Drizzle)  │                                          │
│   └─────────────┘                                          │
└────────────────────────────────────────────────────────────┘
```

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

Este proyecto usa un archivo `.env` en la raíz para configurar tanto el backend como el frontend. Copia el ejemplo:

```bash
cp .env.example .env
```

### Variables de entorno

#### Backend (`backend/`)

```env
# URL de conexión a PostgreSQL
DATABASE_URL=postgresql://shorturl:shorturl@localhost:5432/shorturl

# Clave API para operaciones de administración
SERVICE_ADMIN_API_KEY=tu_api_key_secreta

# Puerto donde correra la API (opcional, por defecto 5044)
API_PORT=5044
```

#### Frontend (`frontend/`)

```env
# URL base de la API del backend
VITE_API_BASE_URL=http://localhost:5044

# Clave API para el frontend (debe coincidir con SERVICE_ADMIN_API_KEY)
VITE_API_KEY=tu_api_key_secreta

# Contraseña para acceder a funciones de admin en el frontend
VITE_ADMIN_PASS=tu_password_admin
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
cd backend
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
bun run test:unit         # solo tests unitarios
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
# Desarrollo (desde la raíz)
bun run dev:front        # iniciar frontend (localhost:5173)
cd backend && bun run dev  # iniciar backend (localhost:5044)

# Build
bun run build:front      # build del frontend
bun run build:back       # build del backend

# Base de datos
cd backend && bun run db:push    # aplicar cambios al schema
cd backend && bun run db:generate # generar migración desde schema

# Formato
bun run format:front     # formatea frontend con Biome
cd backend && bun run format  # formatea backend con Biome

# Tests
cd backend && bun test   # ejecutar todos los tests
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
