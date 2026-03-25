# AGENTS.md — Backend (shorturl)

Guía para agentes de IA trabajando en el backend.

---

## Stack Tecnológico

| Tecnología | Propósito |
|------------|------------|
| **Bun** | Runtime de JavaScript/TypeScript |
| **Hono** | Framework web (API REST) |
| **PostgreSQL** | Base de datos relacional |
| **Drizzle ORM** | ORM para consultas y migraciones |
| **Docker** | Contenedores (despliegue) |

---

## Arquitectura Hexagonal

```
src/
├── domain/           # Entidades y puertos (interfaces)
├── application/      # Casos de uso (lógica de negocio)
├── infrastructure/    # Implementaciones (BD, HTTP)
└── presentation/     # Rutas y controladores HTTP
```

### Capas

- **domain**: Define entidades (`Url`) y puertos (`UrlRepositoryPort`)
- **application**: Casos de uso (`CreateUrlUseCase`, `RedirectUrlUseCase`, etc.)
- **infrastructure**: Implementación del repositorio, inicialización de DB
- **presentation**: Rutas Hono (`/v1/urls`, `/v1/admin`, `/redirect`)

---

## Estructura de Archivos Clave

```
backend/
├── src/
│   ├── domain/url/          # Entidad + puerto
│   ├── application/url/    # Casos de uso
│   ├── infrastructure/     # Implementaciones
│   ├── presentation/http/  # Rutas API
│   ├── db/                 # Schema Drizzle
│   └── index.ts            # Entry point
├── drizzle/                 # Migraciones SQL
├── tests/unit/             # Tests unitarios
└── package.json
```

---

## Variables de Entorno

Crear `backend/.env`:

```env
SERVICE_ADMIN_API_KEY=tu_api_key
DATABASE_URL=postgres://shorturl:shorturl@localhost:5432/shorturl
```

---

## Comandos

```bash
# Desarrollo
bun run dev              # Inicia servidor en localhost:5044
bun run build            # Build de producción

# Base de datos
bun run db:generate      # Genera migración desde schema
bun run db:push          # Aplica cambios al DB
bun run db:migrate       # Ejecuta migraciones

# Tests
bun test                 # Todos los tests
bun run test:unit        # Solo tests unitarios
bun run test:watch       # Modo watch

# Format
bun run format           # Formatea con Biome
```

---

## Rutas API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/v1/urls` | Crear URL corta |
| `GET` | `/v1/urls` | Listar todas |
| `GET` | `/v1/urls/:shortCode` | Obtener por código |
| `DELETE` | `/v1/admin/urls/:shortCode` | Eliminar (requiere auth) |
| `DELETE` | `/v1/admin/urls` | Eliminar todas (requiere auth) |
| `GET` | `/:shortCode` | Redirección (302) |

### Autenticación

Rutas admin requieren header:
```
Authorization: Bearer <SERVICE_ADMIN_API_KEY>
```

---

## Convenciones de Código

- **TypeScript** strict mode
- **Zod** para validación de schemas
- **Biome** para format y lint
- **Nombres**: camelCase para variables, PascalCase para tipos/clases
- **Comentarios**: solo si explican "por qué", no "qué"
- **Errores**: usar `AppError` con código y mensaje

---

## Testing

- Ubicación: `tests/unit/`
- Framework: Bun test (built-in)
- Mock del repositorio: `tests/__mocks__/url.repository.mock.ts`
- Naming: `<nombrerecurso>.<nombrecasodeuso>.test.ts`

---

## Docker

El backend corre en contenedor vía `docker-compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:16-alpine
  backend:
    build: ./backend
    ports:
      - "5044:5044"
```

---

## Convenciones de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

[body opcional]
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

Ejemplo: `feat(urls): add shortCode validation with custom error`