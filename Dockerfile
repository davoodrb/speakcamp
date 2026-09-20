ARG NODE_VERSION=lts-alpine

FROM node:${NODE_VERSION} AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-workspace.yaml .npmrc* ./

RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_LIVEKIT_URL
ENV VITE_LIVEKIT_URL=$VITE_LIVEKIT_URL

RUN pnpm prisma generate
RUN pnpm build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

RUN mkdir -p /app/data && \
    chown -R nodejs:nodejs /app/data

COPY --from=builder /app/.output ./.output

EXPOSE 3000

USER nodejs

CMD ["node", ".output/server/index.mjs"]
