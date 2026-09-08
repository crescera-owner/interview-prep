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

# --- runtime stage: only the compiled output + production deps ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
COPY --from=build /app/packages/api/dist ./dist
COPY --from=build /app/packages/api/package.json ./package.json
RUN pnpm install --prod --ignore-workspace

RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser

EXPOSE 3000
CMD ["node", "dist/index.js"]
