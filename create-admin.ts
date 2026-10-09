import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';
import { supabaseAuthEnabled, supabaseUpsertUser } from '../src/lib/supabase';

/**
 * Usage:
 *   npm run create-admin                      (interactive; password is not echoed)
 *   ADMIN_EMAIL=a@b.com ADMIN_PASSWORD='...' ADMIN_NAME='Name' npm run create-admin
 * Running it again for an existing e-mail resets that account's password.
 */
function ask(prompt: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      (rl as any)._writeToOutput = (s: string) => {
        if (s.includes(prompt)) process.stdout.write(s);
      };
    }
    rl.question(prompt, (a) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(a.trim());
    });
  });
}

(async () => {
  process.env.AUTO_SEED = 'false';
  const email = (process.env.ADMIN_EMAIL || (await ask('Admin e-mail: '))).toLowerCase();
  const name = process.env.ADMIN_NAME || (await ask('Display name: '));
  const password = process.env.ADMIN_PASSWORD || (await ask('Password (min 12 characters): ', true));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Invalid e-mail address.');
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  const d = await db();
  if (supabaseAuthEnabled()) {
    // Supabase mode: the password lives in Supabase Auth; this table is only the allow-list of admins.
    const how = await supabaseUpsertUser(email, password);
    await d.query(
      `INSERT INTO admin_users (email, name, password_hash) VALUES ($1,$2,'')
       ON CONFLICT (email) DO UPDATE SET name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE admin_users.name END, password_hash = ''`,
      [email, name],
    );
    console.log(`Supabase Auth user ${how} and added to the admin allow-list: ${email}`);
  } else {
    const hash = await bcrypt.hash(password, 12);
    await d.query(
      `INSERT INTO admin_users (email, name, password_hash) VALUES ($1,$2,$3)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE admin_users.name END`,
      [email, name, hash],
    );
    console.log(`Admin account ready (local mode): ${email}`);
  }
  process.exit(0);
})().catch((e) => {
  console.error(`Error: ${e.message || e}`);
  process.exit(1);
});
