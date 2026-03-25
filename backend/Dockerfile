FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/package.json
RUN cd /temp/dev && bun install

RUN mkdir -p /temp/prod
COPY package.json /temp/prod/package.json
RUN cd /temp/prod && bun install --production

FROM base AS prerelease
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS release
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/drizzle ./drizzle
COPY --from=prerelease /usr/src/app/package.json ./package.json

USER bun
EXPOSE 5044/tcp
ENTRYPOINT ["bun", "run", "dist/index.js"]
