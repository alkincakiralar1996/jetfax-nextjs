import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Lazy DB singleton. Defers the DATABASE_URL check to request time so
 * `next build` does not fail when the env var is absent at build time.
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (cached) return cached;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  cached = drizzle(neon(connectionString), { schema });
  return cached;
}

export { schema };
