# interview-prep

A pnpm + Turborepo monorepo for TypeScript backend interview prep.

## Packages

- `packages/order-calculator` — small TS exercise (unit tests with Vitest)
- `packages/api` — Express + TypeScript backend (`/health`, `/orders/total`), tested with Vitest + Supertest, containerized via `Dockerfile`
- `packages/infra` — AWS CDK (TypeScript) app that deploys `api` as an ECS Fargate service behind an Application Load Balancer

## Commands (run from the repo root)

```bash
pnpm install       # install all workspace packages
pnpm build         # turbo: build every package
pnpm test          # turbo: test every package
pnpm lint          # turbo: lint every package

pnpm --filter @interview-prep/api run dev     # run the API locally with hot reload
pnpm --filter @interview-prep/infra run synth # render CloudFormation locally (no AWS calls)
pnpm --filter @interview-prep/infra run deploy # actually deploy to AWS (costs money, needs credentials)
```
