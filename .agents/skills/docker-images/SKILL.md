---
name: docker-images
description: Build and push Docker images to Docker Hub with proper versioning. Tags must follow semantic versioning (vx.x.x) with latest pointing to the most recent version.
license: LICENSE.txt
---

This skill provides instructions for building and pushing Docker images to Docker Hub for this project.

---

# Docker Image Repositories

This project uses the following Docker Hub repositories:

- **Backend**: `roldyoran/cubepath-shorturl-backend`
- **Frontend**: `roldyoran/cubepath-shorturl-frontend`

---

# Build and Push Process

## Prerequisites

1. Ensure Docker with buildx is installed and configured
2. Ensure you are logged in to Docker Hub (`docker login`)
3. Ensure all changes are committed before building

## Version Tagging Strategy

- Tags must follow semantic versioning: `vx.x.x` (e.g., `v1.2.0`)
- Always push two tags:
  - Version tag: `vX.X.X` (e.g., `v1.1.0`)
  - Latest tag: `latest` (always points to the most recent version)

## Determining the Next Version

Before building, determine the next version number:

1. Check existing tags in the repository:
   ```bash
   docker buildx imagetools inspect roldyoran/cubepath-shorturl-backend:latest
   ```

2. Increment the version based on the type of changes:
   - **Major** (X.0.0): Breaking changes or significant refactoring
   - **Minor** (1.X.0): New features or backwards-compatible changes
   - **Patch** (1.1.X): Bug fixes or small improvements

3. If unsure, default to **patch** version increment

---

# Build Commands

## Backend Image

```bash
docker buildx build \
  --push \
  --platform=linux/amd64,linux/arm64 \
  -t roldyoran/cubepath-shorturl-backend:latest \
  -t roldyoran/cubepath-shorturl-backend:vX.X.X \
  -f backend/Dockerfile \
  backend/
```

## Frontend Image

```bash
docker buildx build \
  --push \
  --platform=linux/amd64,linux/arm64 \
  -t roldyoran/cubepath-shorturl-frontend:latest \
  -t roldyoran/cubepath-shorturl-frontend:vX.X.X \
  -f frontend/Dockerfile \
  frontend/
```

Replace `vX.X.X` with the actual version number (e.g., `v1.1.0`).

---

# Build Arguments (Frontend Only)

The frontend Dockerfile accepts the following build arguments:

| Argument | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Base URL for API | No |
| `VITE_API_KEY` | API key for authentication | No |
| `VITE_ADMIN_PASS` | Admin password | No |

Example with arguments:

```bash
docker buildx build \
  --push \
  --platform=linux/amd64,linux/arm64 \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_API_KEY=your-api-key \
  -t roldyoran/cubepath-shorturl-frontend:latest \
  -t roldyoran/cubepath-shorturl-frontend:vX.X.X \
  -f frontend/Dockerfile \
  frontend/
```

---

# Cleanup Old Images

Before pushing new images, clean up old version tags to keep the repository organized.

## List All Tags

```bash
docker buildx imagetools inspect roldyoran/cubepath-shorturl-backend:latest
docker buildx imagetools inspect roldyoran/cubepath-shorturl-frontend:latest
```

## Remove Old Tags

Use Docker Hub UI or CLI to remove old version tags. Keep only:
- `latest` (always)
- Current version tag (e.g., `v1.1.0`)
- Previous version if needed for rollback

---

# Workflow Summary

1. **Determine next version**: Check existing tags and decide version increment
2. **Commit all changes**: Ensure all code changes are committed
3. **Build and push backend**: Run backend build command with version tag
4. **Build and push frontend**: Run frontend build command with version tag
5. **Verify images**: Check that both latest and version tags are available
6. **Cleanup old tags**: Remove old version tags from Docker Hub

---

# Important Notes

- Always push both `latest` and version tag (e.g., `v1.1.0`)
- The `latest` tag should always point to the most recent version
- Use multi-platform builds (`linux/amd64,linux/arm64`) for compatibility
- Ensure build completes successfully before cleanup
- Never delete images that are currently in production use
