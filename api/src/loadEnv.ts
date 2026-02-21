/**
 * Load api/.env before any other module reads process.env.
 * Import this first in entry points (index.ts, scripts/seed.ts).
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
