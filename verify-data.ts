import fs from 'node:fs';
import path from 'node:path';

/** Cross-checks seed JSON against the figures the profile states. Prints a pass/warn report. */
const dir = path.join(process.cwd(), 'data', 'seed');
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, `${f}.json`), 'utf8'));

let warn = 0;
const ok = (m: string) => console.log(`  ✓ ${m}`);
const bad = (m: string) => { warn++; console.log(`  ! ${m}`); };
const check = (c: boolean, good: string, badMsg: string) => (c ? ok(good) : bad(badMsg));

const stats = read('stats');
const pubs = read('publications');
const patents = read('patents');
const projects = read('projects');
const scholars = read('scholars');
const awards = read('awards');
const social = read('social_links');

console.log('Statistics (as stated in the profile)');
const sv = (k: string) => stats.find((s: any) => s.key === k)?.value;
check(sv('scopus_articles') === '310', 'Scopus/WoS articles = 310', `Scopus/WoS articles is ${sv('scopus_articles')}`);
check(sv('scopus_citations') === '10,310', 'Scopus citations = 10,310', `Scopus citations is ${sv('scopus_citations')}`);
check(sv('scopus_h') === '53', 'Scopus h-index = 53', `Scopus h-index is ${sv('scopus_h')}`);
check(sv('gs_articles') === '353', 'Scopus/WoS/Google Scholar articles = 353', `GS articles is ${sv('gs_articles')}`);
check(sv('gs_citations') === '15,688', 'GS citations = 15,688', `GS citations is ${sv('gs_citations')}`);
check(sv('gs_h') === '65', 'GS h-index = 65', `GS h-index is ${sv('gs_h')}`);
check(sv('patents') === '21', 'Granted patents (stated) = 21', `Stated patents is ${sv('patents')}`);

console.log('Record counts');
const granted = patents.filter((p: any) => p.status === 'Granted').length;
check(granted === 21, `Granted patents listed = ${granted}`, `Granted patents listed = ${granted}, stated 21`);
console.log(`  · Publications compiled: ${pubs.length} unique (310 / 353 are the profile's stated totals; they are NOT reconciled)`);
console.log(`  · Patents listed: ${patents.length} (${granted} granted, ${patents.length - granted} published)`);
console.log(`  · Ph.D. scholars: ${scholars.length}; awards: ${awards.length}; projects: ${projects.length}`);

console.log('Funding');
const lakhs = projects.reduce((a: number, p: any) => a + (Number(p.amountLakhs) || 0), 0);
console.log(`  · Sum of stated project amounts: ${lakhs.toFixed(2)} lakhs (profile states "~ 2 Crores" = 200 lakhs; shown separately)`);

console.log('Data hygiene');
const dup = new Set<string>();
let dups = 0;
for (const p of pubs) {
  const k = (p.doi || p.title).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (dup.has(k)) dups++;
  dup.add(k);
}
check(dups === 0, 'No duplicate publications by DOI/title', `${dups} duplicate publication keys`);
const noYear = pubs.filter((p: any) => !p.year).length;
if (noYear) bad(`${noYear} publications have no year (shown at the end of lists)`); else ok('All publications have a year');
const noDoi = pubs.filter((p: any) => !p.doi).length;
console.log(`  · Publications without DOI: ${noDoi}`);
const noUni = scholars.filter((s: any) => !s.university).length;
if (noUni) bad(`${noUni} scholars have no university recorded (not stated in source)`);

console.log('Social links');
const want = ['https://www.facebook.com/palanikumar.k.54', 'https://www.linkedin.com/in/dr-palanikumar-k-5ba50827/', 'https://scholar.google.com/citations?user=ibexnM4AAAAJ&sortby=pubdate'];
check(social.length === 3 && want.every((u) => social.some((s: any) => s.url === u)), 'Only the three verified links are present (Facebook, LinkedIn, Google Scholar)', 'Social links differ from the verified set');

console.log(warn ? `\n${warn} item(s) need a human look — see DATA_VERIFICATION.md` : '\nAll checks passed.');
process.exit(0);
