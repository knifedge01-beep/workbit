/**
 * Run with: npm run seed (from api folder: cd api && npm run seed)
 *
 * - File store: writes one data.json.
 * - Supabase: writes to separate tables in dependency order (roles → members → teams
 *   → projects → views → invitations → project_properties → status_updates →
 *   status_update_comments → milestones → activity → issues → notifications).
 *   Run api/scripts/create-separate-tables.sql in Supabase first if tables are missing.
 */
import '../loadEnv.js';
import { seedDummy } from '../utils/seed.js';

async function main() {
  await seedDummy();
  console.log('Dummy data seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  const msg = err?.message ?? String(err);
  if (msg.includes('Could not find the table') || (msg.includes('does not exist') && msg.includes('relation'))) {
    console.error('Seed failed: Supabase tables are missing.');
    console.error('Run api/scripts/create-separate-tables.sql in Supabase Dashboard → SQL Editor, then run: cd api && npm run seed');
  } else {
    console.error('Seed failed:', err);
  }
  process.exit(1);
});
