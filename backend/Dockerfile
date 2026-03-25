FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json ./backend/package.json
RUN bun install --frozen-lockfile

COPY backend ./backend

WORKDIR /app/backend

EXPOSE 5044

CMD ["bun", "run", "src/index.ts"]
