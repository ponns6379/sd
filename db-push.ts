import { db } from '../src/lib/db';

(async () => {
  process.env.AUTO_SEED = 'false';
  const d = await db();
  const t = await d.query("SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'public'");
  console.log(`Schema is up to date (${d.kind}). Tables: ${t[0]?.n}.`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
