# AGENTS.md — shorturl (raíz)

Guía mínima para agentes de IA en este monorepo.

---

## ¿Qué hace el proyecto?

**shorturl** es un acortador de URLs con:

- **Backend**: API REST (Hono + Cloudflare Workers + D1 + Drizzle). Crear/listar/buscar/redirigir/eliminar URLs; arquitectura hexagonal.
- **Frontend**: App web (Vue 3 + Vite + Shadcn-VUE). Acortar URLs, ver info, gestionar “mis URLs” y lista pública.

Cada parte tiene su propia guía para agentes.

---

## Guías por área

| Área      | Archivo              | Contenido |
|----------|----------------------|-----------|
| Backend  | [backend/AGENTS.md](backend/AGENTS.md)  | API, arquitectura hexagonal, casos de uso, rutas, D1, tests, convenciones. |
| Frontend | [frontend/AGENTS.md](frontend/AGENTS.md) | Vue 3, componentes, Pinia, Shadcn-VUE, convenciones de UI y código. |

---

## Uso explícito para agentes

- **Si estás trabajando en el backend** (cualquier cosa bajo `backend/`, API, D1, casos de uso, rutas, tests del backend): **lee y aplica [backend/AGENTS.md](backend/AGENTS.md)** antes de editar. Ahí están la arquitectura, convenciones y reglas del backend.
- **Si estás trabajando en el frontend** (cualquier cosa bajo `frontend/`, componentes Vue, stores, UI, llamadas a la API desde la app): **lee y aplica [frontend/AGENTS.md](frontend/AGENTS.md)** antes de editar. Ahí están el stack, convenciones de componentes y reglas de UI.

Usa la guía del área en la que estés tocando código para no saltarte convenciones ni reglas críticas.

---

## Comandos del Monorepo

> **IMPORTANTE**: Este es un monorepo con **bun** como package manager. Todos los comandos deben ejecutarse desde la raíz o especificar el workspace.

### Scripts disponibles

```bash
# Desarrollo
bun run dev:front     # Inicia servidor frontend
bun run dev:back      # Inicia servidor backend

# Build
bun run build:front   # Build del frontend
bun run build:back    # Build del backend

# Verificación de código (frontend)
bun run check         # Verifica código con Biome (no hace build)
bun run format        # Formatea código con Biome
bun run lint          # Lint y auto-fix con Biome
```

### Instalar dependencias

```bash
# Desde la raíz (instala todos los workspaces)
bun install

# Opcional: instalar solo un workspace
bun install --cwd frontend
bun install --cwd backend
```

---

## Conventional Commits

Los mensajes de commit deben seguir el formato de [Conventional Commits](https://www.conventionalcommits.org/) en **inglés**:

```
<tipo>(<alcance>): <descripción>

[body opcional]

[footer opcional]
```

Tipos comunes:
- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `refactor` — refactorización sin cambio de comportamiento
- `docs` — documentación
- `test` — tests
- `chore` — tareas de mantenimiento

Ejemplo: `feat(urls): add shortCode validation with custom error`
