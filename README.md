<h1 align="center">SHORTURL</h1>

<p align="center">by roldyoran</p>

> **Español**: [Documentación en español](./docs/README.es.md)

> **Note**: This repository is primarily focused on the **backend** (URL shortener API). The frontend is a simple Vue 3 application used to test the API with a nice UI, but it's not the main focus of this project.

---

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) ≥ 4.0 (included as devDependency)
- A Cloudflare account with a D1 database created

---

## Installation

```bash
# 1. Clone the repository
git clone git@github.com:roldyoran/shorturl.git
cd shorturl

# 2. Install dependencies
bun install
```

---

## Configuration

### 1. Environment variables (local)

Create a `.env` file in the project root:

```env
SERVICE_ADMIN_API_KEY=your_secret_api_key
```

### 2. Wrangler — D1 binding

Edit `wrangler.jsonc` and replace the `database_id` with your D1 database ID:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "shorturl",
      "database_id": "<your-database-id>"
    }
  ]
}
```

### 3. Database migrations

```bash
# Apply migrations to local D1 (development)
bun run db:migrate:local

# Apply migrations to remote D1 (production)
bun run db:migrate:remote
```

---

## Local Development

```bash
bun dev
```

The server starts at `http://localhost:8787`.

---

## API Usage

### Create a short URL

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

### Create a URL with custom shortCode

```bash
curl -X POST http://localhost:8787/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://hono.dev", "shortCode": "hono"}'
```

### Redirect to original URL

```bash
curl -L http://localhost:8787/c04jzv
```

Responds with `302 Location: https://www.epicgames.com` and increments the visit counter.

### List all URLs

```bash
curl http://localhost:8787/v1/urls
```

### Get a URL by shortCode

```bash
curl http://localhost:8787/v1/urls/c04jzv
```

### Delete a URL (requires API key)

```bash
curl -X DELETE http://localhost:8787/v1/admin/urls/c04jzv \
  -H "Authorization: Bearer your_secret_api_key"
```

### Delete all URLs (requires API key)

```bash
curl -X DELETE http://localhost:8787/v1/admin/urls \
  -H "Authorization: Bearer your_secret_api_key"
```

---

## Tests

```bash
bun test                  # all tests
bun run test:watch       # watch mode
bun run test:coverage    # with coverage report
bun run test:bail        # abort on first failure
```

---

## Deploy to Cloudflare Workers

```bash
bun deploy
```

---

## Useful Commands

```bash
bun format                 # format code with Biome
bun run db:generate        # generate migration SQL from schema
bun run db:studio          # open Drizzle Studio to inspect the DB
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
cd frontend
bun dev
```

The frontend runs on `http://localhost:5173` (Vite default).

### Frontend Tech Stack

- Vue 3 (Composition API)
- Vite
- Pinia (state management)
- Shadcn-VUE (UI components)
- Tailwind CSS
- TypeScript
