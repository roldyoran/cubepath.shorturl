<h1 align="center">CUBEPATH.SHORTURL</h1>

<p align="center">by roldyoran</p>

> **Español**: [Documentación en español](./docs/README.es.md)

> **Note**: This repository is primarily focused on the **backend** (URL shortener API). The frontend is a simple Vue 3 application used to test the API with a nice UI, but it's not the main focus of this project.

---

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- [Docker](https://www.docker.com/) and Docker Compose

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/roldyoran/cubepath.shorturl.git
cd cubepath.shorturl

# 2. Install dependencies
bun install
```

---

## Configuration

Create a `.env` file in the `backend/` folder:

```env
SERVICE_ADMIN_API_KEY=your_secret_api_key
```

---

## Quick Start (Docker)

```bash
# Start all services (PostgreSQL + Backend)
docker-compose up -d
```

The backend API starts at `http://localhost:5044`.

---

## Local Development (Without Docker)

### 1. Start PostgreSQL

```bash
# Using Docker only for the database
docker run -d \
  --name shorturl-db \
  -e POSTGRES_USER=shorturl \
  -e POSTGRES_PASSWORD=shorturl \
  -e POSTGRES_DB=shorturl \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Run Database Migrations

```bash
cd backend
bun run db:push
```

### 3. Start the Backend

```bash
bun run dev:back
```

The server starts at `http://localhost:5044`.

---

## API Usage

### Create a short URL

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

### Create a URL with custom shortCode

```bash
curl -X POST http://localhost:5044/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://hono.dev", "shortCode": "hono"}'
```

### Redirect to original URL

```bash
curl -L http://localhost:5044/c04jzv
```

Responds with `302 Location: https://www.epicgames.com` and increments the visit counter.

### List all URLs

```bash
curl http://localhost:5044/v1/urls
```

### Get a URL by shortCode

```bash
curl http://localhost:5044/v1/urls/c04jzv
```

### Delete a URL (requires API key)

```bash
curl -X DELETE http://localhost:5044/v1/admin/urls/c04jzv \
  -H "Authorization: Bearer your_secret_api_key"
```

### Delete all URLs (requires API key)

```bash
curl -X DELETE http://localhost:5044/v1/admin/urls \
  -H "Authorization: Bearer your_secret_api_key"
```

---

## Tests

```bash
cd backend
bun test                  # all tests
bun run test:watch       # watch mode
```

---

## Tech Stack

### Backend

- [Bun](https://bun.sh) - JavaScript runtime
- [Hono](https://hono.dev) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - ORM
- [Docker](https://www.docker.com/) - Containerization

### Frontend

- Vue 3 (Composition API)
- Vite
- Pinia (state management)
- Shadcn-VUE (UI components)
- Tailwind CSS
- TypeScript

---

## Useful Commands

```bash
# Development
bun run dev:front        # start frontend
bun run dev:back         # start backend

# Build
bun run build:front      # build frontend
bun run build:back       # build backend

# Format
bun run format:front     # format frontend with Biome
cd backend && bun run format  # format backend with Biome
```

---

## Frontend (Vue 3)

The project includes a simple Vue 3 frontend to test the API with a user-friendly interface.

### Frontend Features

- **Shorten URLs**: Create short URLs directly from the UI
- **URL Management**: View, copy, and delete your shortened URLs
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Public URL List**: Browse publicly shortened URLs
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works on desktop and mobile devices

### Running the Frontend

```bash
bun run dev:front
```

The frontend runs on `http://localhost:5173` (Vite default).