import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadConfig } from "@veltra/config";

function resolveEnvPath(): string | undefined {
  const searchRoots = [
    process.cwd(),
    path.dirname(fileURLToPath(import.meta.url))
  ];

  for (const start of searchRoots) {
    let current = start;

    for (let depth = 0; depth < 8; depth += 1) {
      const candidate = path.join(current, ".env");

      if (existsSync(candidate)) {
        return candidate;
      }

      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }

      current = parent;
    }
  }

  return undefined;
}

const envPath = resolveEnvPath();
if (envPath) {
  dotenv.config({ path: envPath });
}

export const appConfig = loadConfig();
