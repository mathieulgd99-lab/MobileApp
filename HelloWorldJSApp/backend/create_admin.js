#!/usr/bin/env node
require('dotenv').config();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Script to add administrator into the database, run on your terminal:
// node create_admin.js --email Admin --create-if-missing --password "A" --display-name "Admin"



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
    const createIfMissing = argv['create'] || argv.create || false;
    let password = argv.pw || null;
    const displayName = argv['display-name'] || argv.display_name || null;
    const dbPath = argv.db || process.env.DB_PATH || './data.db';

    if (!email) {
      console.error('Usage: node promote_admin.js --email user@example.com [--create] [--pw SECRET] [--display-name "Name"] [--db ./data.db]');
      process.exit(1);
    }

    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Look for user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (user) {
      if (user.role === 'admin') {
        console.log(`L'utilisateur ${email} est déjà admin (id=${user.id}).`);
      } else {
        await db.run('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);
        console.log(`Promu en admin : ${email} (id=${user.id}).`);
      }
      await db.close();
      process.exit(0);
    }

    // User not found
    if (!createIfMissing) {
      console.error(`Utilisateur introuvable : ${email}. Utilise --create-if-missing pour le créer et le promouvoir.`);
      await db.close();
      process.exit(2);
    }

    // Create user flow
    if (!password) {
      // Ask interactively
      console.log('Création d\'un nouvel utilisateur — veuillez saisir un mot de passe sécurisé.');
      password = await promptHidden('Password (visible while typing): ');
      if (!password) {
        console.error('Mot de passe vide, abort.');
        await db.close();
        process.exit(3);
      }
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [email, hash, displayName || null, 'admin']
    );
    console.log(`Utilisateur créé et promu en admin : ${email} (id=${result.lastID}).`);
    await db.close();
    process.exit(0);

  } catch (err) {
    console.error('Erreur:', err);
    process.exit(99);
  }
})();