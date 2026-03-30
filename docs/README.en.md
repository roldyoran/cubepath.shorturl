<h1 align="center">CUBEPATH.SHORTURL</h1>

<p align="center">by roldyoran</p>

> **Español**: [Documentación en español](../README.md)

> **Note**: This repository is primarily focused on the **backend** (URL shortener API). The frontend is a simple Vue 3 application used to test the API with a nice UI, but it's not the main focus of the project.

---

## Description

CubePath.ShortURL is a URL shortener built with modern technologies. It allows you to create short, easy-to-remember URLs that redirect to longer ones. The project consists of:

- **Backend**: A REST API built with Hono, TypeScript, and Bun
- **Frontend**: A Vue 3 application with a user-friendly interface

### Live Demo

- **Backend API**: http://cubepathshorturl-zyojcm-c8fd35-144-225-147-24.traefik.me/
- **Frontend**: http://cubepathshorturl-zyojcm-6e7ba3-144-225-147-24.traefik.me/

### Screenshots

![Backend API](./screenshots/backend-demo.png)

![Frontend](./screenshots/frontend-demo-dark.png)

### API Documentation

The backend includes interactive API documentation using the OpenAPI standard:

- **Swagger UI** (`/docs`): Classic interface for exploring and testing API endpoints. Includes information about all endpoints, parameters, responses, and allows direct testing from the browser.

- **Scalar** (`/scalar`): Modern and elegant API documentation. Offers a more refined experience with code examples in multiple languages (cURL, Node.js, Python, PHP, Ruby), ability to test requests directly, and a mobile-friendly UI.

![Swagger UI](./screenshots/backend-docs-swagger.png)

![Scalar](./screenshots/backend-docs-scalar.png)

---

## Deployment with CubePath

This project is deployed on **CubePath** using a **gp.nano** VPS with **Dokploy** and **Docker Compose** for a simple and efficient deployment.

### What is CubePath?

CubePath is a technology infrastructure provider with its own data centers in strategic locations in Europe (Barcelona, Amsterdam) and the United States (Virginia, Miami, Houston). It focuses on providing low latency and high connectivity for applications, controlling traffic routing and physical system location to improve performance.

### Why Dokploy?

[Dokploy](https://dokploy.com/) is a self-hosted PaaS that makes deployment simple. It provides:

- Easy application management via web interface
- Automatic Docker container orchestration
- Built-in support for Traefik as a reverse proxy
- Automatic SSL certificates with Let's Encrypt
- Simple database management

### Deployment Steps

1. **1-Click Deploy from CubePath Marketplace**: The easiest way is to use the **CubePath Marketplace** to deploy **Dokploy** with a single click:
   - Go to [CubePath Marketplace - Dokploy](https://cubepath.com/marketplace/dokploy)
   - Click on **Deploy Now**
   - Select your VPS (gp.nano or larger)
   - Done! Dokploy will automatically install on your VPS

   ![CubePath Marketplace - Dokploy](./screenshots/cubepath-dokploy-marketplace.png)

   You can also see the CubePath dashboard with your deployed apps:

   ![CubePath Dashboard - One Click App](./screenshots/cubepath-dashboard-one-click-app.png)

2. **Configure Traefik**: Dokploy automatically configures Traefik as a reverse proxy with automatic SSL

3. **Deploy the application**: Via the Dokploy web interface:
   - Create a new project
   - Add the backend service (Hono API)
   - Add the frontend service (Vue 3)
   - Configure environment variables
   - Set up domains and SSL certificates

   Or using the `docker-compose.yml` provided in this project

### Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      CubePath VPS (gp.nano)                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Traefik (Reverse Proxy)           │  │
│  │         (Automatic SSL, Domain Routing)              │  │
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

This project uses a `.env` file in the root to configure both the backend and frontend. Copy the example:

```bash
cp .env.example .env
```

### Environment Variables

#### Backend (`backend/`)

```env
# PostgreSQL connection URL
DATABASE_URL=postgresql://shorturl:shorturl@localhost:5432/shorturl

# API key for admin operations
SERVICE_ADMIN_API_KEY=your_secret_api_key

# Port where the API will run (optional, default 5044)
API_PORT=5044
```

#### Frontend (`frontend/`)

```env
# Base URL of the backend API
VITE_API_BASE_URL=http://localhost:5044

# API key for the frontend (must match SERVICE_ADMIN_API_KEY)
VITE_API_KEY=your_secret_api_key

# Password to access admin functions in the frontend
VITE_ADMIN_PASS=your_admin_password
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
cd backend
bun run dev
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
bun run test:unit         # unit tests only
bun run test:watch        # watch mode
```

---

## Tech Stack

### Backend

- [Bun](https://bun.sh) - JavaScript runtime
- [Hono](https://hono.dev) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - ORM
- [Docker](https://www.docker.com/) - Containers

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
# Development (from root)
bun run dev:front        # start frontend (localhost:5173)
cd backend && bun run dev  # start backend (localhost:5044)

# Build
bun run build:front      # build frontend
bun run build:back       # build backend

# Database
cd backend && bun run db:push    # push schema changes
cd backend && bun run db:generate # generate migration from schema

# Format
bun run format:front     # format frontend with Biome
cd backend && bun run format  # format backend with Biome

# Tests
cd backend && bun test   # run all tests
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
