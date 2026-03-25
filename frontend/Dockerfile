FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY . .

RUN bun install

RUN VITE_API_BASE_URL=$VITE_API_BASE_URL VITE_API_KEY=$VITE_API_KEY bunx vite build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
