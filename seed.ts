import { db } from '../src/lib/db';
import { seedAll } from '../src/lib/seed';

(async () => {
  process.env.AUTO_SEED = 'false';
  const wipe = process.argv.includes('--wipe');
  const d = await db();
  if (wipe) console.log('--wipe: existing content will be replaced by the seed data (admin users are kept).');
  await seedAll(d, { wipe });
  console.log('Seed complete.');
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
