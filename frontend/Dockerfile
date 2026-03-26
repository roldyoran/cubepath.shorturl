FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_API_KEY
ARG VITE_ADMIN_PASS

RUN bun install

RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" >> .env && \
    echo "VITE_API_KEY=${VITE_API_KEY}" >> .env && \
    echo "VITE_ADMIN_PASS=${VITE_ADMIN_PASS}" >> .env && \
    bunx vite build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
