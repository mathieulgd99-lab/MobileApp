#!/usr/bin/env node
require('dotenv').config();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const readline = require('readline');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

async function promptHidden(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

(async () => {
  try {
    const argv = parseArgs();

    const email = argv.email;
    const displayName = argv['display-name'] || argv.display_name;
    const role = argv.role === 'admin' ? 'admin' : 'user';
    let password = argv.pw || null;
    const dbPath = argv.db || process.env.DB_PATH || './data.db';

    if (!email || !displayName) {
      console.error(
        'Usage: node create_user.js --email user@example.com --display-name "Name" [--pw SECRET] [--role admin|user] [--db ./data.db]'
      );
      process.exit(1);
    }

    if (!password) {
      password = await promptHidden('Password (visible while typing): ');
      if (!password) {
        console.error('Mot de passe vide, abort.');
        process.exit(2);
      }
    }

    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      console.error(`Utilisateur déjà existant : ${email}`);
      await db.close();
      process.exit(3);
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await db.run(
      'INSERT INTO users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [email, hash, displayName, role]
    );

    console.log(`Utilisateur créé : ${email}`);
    console.log(`→ id=${result.lastID}, role=${role}`);

    await db.close();
    process.exit(0);

  } catch (err) {
    console.error('Erreur:', err);
    process.exit(99);
  }
})();
