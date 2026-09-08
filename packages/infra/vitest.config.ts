import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/cdk.out/**'],
    // CDK's Template.fromStack() shells out to `docker build` for the api
    // image asset, which can take much longer than Vitest's 5s default.
    testTimeout: 30000,
  },
});
