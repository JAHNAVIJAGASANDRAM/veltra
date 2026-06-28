import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@veltra/config": `${root}/packages/config/src/index.ts`,
      "@veltra/contracts": `${root}/packages/contracts/src/index.ts`,
      "@veltra/security": `${root}/packages/security/src/index.ts`
    }
  },
  test: {
    environment: "node"
  }
});
