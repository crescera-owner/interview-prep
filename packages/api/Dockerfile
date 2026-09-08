# --- build stage: compile TypeScript with full devDependencies available ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/api/package.json packages/api/package.json
COPY packages/order-calculator/package.json packages/order-calculator/package.json
COPY packages/infra/package.json packages/infra/package.json

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
RUN pnpm install --frozen-lockfile --filter @interview-prep/api...

COPY tsconfig.base.json ./
COPY packages/api packages/api

RUN pnpm --filter @interview-prep/api run build

# `pnpm deploy` packs the built package together with a prod-only
# node_modules resolved straight from the lockfile that was just verified
# above — no second `pnpm install` against the registry in the runtime
# stage, so the production image can't silently drift from what was tested.
RUN pnpm --filter @interview-prep/api --prod deploy /prod/api

# --- runtime stage: only the deployed, lockfile-pinned output ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /prod/api ./

RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser

EXPOSE 3000
CMD ["node", "dist/index.js"]
