const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initDb() {
    const db = await open({ filename: './data.db', driver: sqlite3.Database });
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          boulder_id TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
      await db.exec(`
        CREATE TABLE IF NOT EXISTS boulder (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id TEXT NOT NULL,
        grade INTEGER NOT NULL,
        color TEXT NOT NULL,
        path TEXT NOT NULL,
        uploaded_by INTEGER,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        archived_at DATETIME DEFAULT NULL,
        is_current INTEGER NOT NULL DEFAULT 1,
        original_filename TEXT,
        mime_type TEXT,
        filesize INTEGER,
        FOREIGN KEY(uploaded_by) REFERENCES users(id)
        );
      `);
      await db.exec(`
        CREATE TABLE IF NOT EXISTS boulder_validations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        boulder_id INTEGER NOT NULL,
        validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, boulder_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(boulder_id) REFERENCES boulder(id)
        );
      `);
      return db;
    }
    
    module.exports = initDb;