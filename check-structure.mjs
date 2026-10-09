// Runs automatically before `next build` (see "prebuild" in package.json).
// Gives a precise message when files were lost during a GitHub web upload.
import fs from 'node:fs';

const need = [
  ['src/app/layout.tsx', 1], ['src/app/(site)/page.tsx', 1], ['src/app/admin/login/page.tsx', 1],
  ['src/app/uploads/[...path]/route.ts', 1], ['src/lib/db.ts', 1], ['src/middleware.ts', 1],
  ['src/components/Header.tsx', 1], ['next.config.mjs', 1], ['tailwind.config.ts', 1],
  ['data/seed/profile.json', 2], ['public/images/profile.jpg', 2], ['public/files/Bio-Data-K-Palanikumar.pdf', 2],
  ['scripts/create-admin.ts', 2], ['supabase/migrations/20261009000000_init.sql', 2],
];
const missing = need.filter(([p]) => !fs.existsSync(p));
if (missing.length) {
  const top = fs.readdirSync('.').filter((n) => !n.startsWith('.git') && n !== 'node_modules').sort();
  console.error('\n==================== PROJECT FILES ARE MISSING ====================');
  console.error('The repository does not contain the full project. Missing:');
  for (const [p, part] of missing) console.error(`  - ${p}   (from github-part-${part}.zip)`);
  console.error('\nTop level of this repository currently contains: ' + top.join(', '));
  console.error('\nThe folders src, public, data, scripts and supabase must sit at the TOP LEVEL');
  console.error('of the repository (next to package.json). Re-upload the missing part, or use the');
  console.error('GitHub Desktop method in DEPLOY.md (it uploads every file reliably).');
  console.error('===================================================================\n');
  process.exit(1);
}
