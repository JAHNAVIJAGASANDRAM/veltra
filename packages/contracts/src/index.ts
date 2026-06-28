import { z } from "zod";

export const healthStatusSchema = z.object({
  status: z.enum(["ok", "degraded", "unavailable"]),
  service: z.string(),
  timestamp: z.string().datetime(),
  checks: z.record(z.string(), z.enum(["ok", "degraded", "unavailable"]))
});

export type HealthStatus = z.infer<typeof healthStatusSchema>;

export const systemInfoSchema = z.object({
  name: z.literal("Veltra"),
  version: z.string(),
  environment: z.string(),
  securityPosture: z.literal("foundation")
});

export type SystemInfo = z.infer<typeof systemInfoSchema>;
