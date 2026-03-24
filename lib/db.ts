import { createClient } from "@libsql/client";
import dns from "node:dns";

// Force IPv4 resolution to prevent Turso ETIMEDOUT issues on Node 18+
dns.setDefaultResultOrder("ipv4first");

export const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_TOKEN!,
});
