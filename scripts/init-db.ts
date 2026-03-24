import "dotenv/config";
import { initDb } from "../lib/auth";

async function main() {
  try {
    await initDb();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

main();
