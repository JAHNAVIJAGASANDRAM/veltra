import { generateKeyPairSync } from "node:crypto";
import {
  decodePemFromBase64,
  loadJwtKeyPair,
  type JwtKeyPair
} from "@veltra/security";
import type { VeltraConfig } from "@veltra/config";

let cachedKeyPair: JwtKeyPair | undefined;

function generateDevelopmentKeyPair(): Promise<JwtKeyPair> {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048
  });

  const privatePem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  const publicPem = publicKey.export({ type: "spki", format: "pem" }).toString();

  return loadJwtKeyPair(privatePem, publicPem);
}

export async function getJwtKeyPair(config: VeltraConfig): Promise<JwtKeyPair> {
  if (cachedKeyPair) {
    return cachedKeyPair;
  }

  const privatePem = decodePemFromBase64(config.JWT_PRIVATE_KEY_B64);
  const publicPem = decodePemFromBase64(config.JWT_PUBLIC_KEY_B64);

  try {
    cachedKeyPair = await loadJwtKeyPair(privatePem, publicPem);
    return cachedKeyPair;
  } catch (error) {
    if (config.NODE_ENV === "production") {
      throw error;
    }

    cachedKeyPair = await generateDevelopmentKeyPair();
    return cachedKeyPair;
  }
}

export function resetJwtKeyPairCache(): void {
  cachedKeyPair = undefined;
}
