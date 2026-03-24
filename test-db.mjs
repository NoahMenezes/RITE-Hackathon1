import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const db = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_TOKEN });
await db.execute('DELETE FROM tasks WHERE id = 1');
