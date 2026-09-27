import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(envFilePath)) {
  try {
    const rawEnv = fs.readFileSync(envFilePath, 'utf8');
    for (const line of rawEnv.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const eqIdx = trimmed.indexOf('=');
        const envKey = trimmed.substring(0, eqIdx).trim();
        const envVal = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[envKey]) {
          process.env[envKey] = envVal;
        }
      }
    }
  } catch (err) {
    console.warn('[Env] Could not parse local .env file:', err.message);
  }
}

// Mode determination: DEMO_MODE defaults to true if not explicitly set to 'false' AND no DATABASE_URL is present
const hasDbUrl = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_CONNECTION_STRING);
if (process.env.DEMO_MODE === undefined) {
  process.env.DEMO_MODE = hasDbUrl ? 'false' : 'true';
}

export const IS_DEMO_MODE = process.env.DEMO_MODE === 'true';
