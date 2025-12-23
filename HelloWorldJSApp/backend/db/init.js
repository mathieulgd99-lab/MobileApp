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
        total_points REAL NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  
    // COMMENTS
    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        boulder_id INTEGER NOT NULL,
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
  
        validations_count INTEGER NOT NULL DEFAULT 0,
        current_point REAL NOT NULL DEFAULT 0,
  
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
  
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_bv_user ON boulder_validations(user_id);
      CREATE INDEX IF NOT EXISTS idx_bv_boulder ON boulder_validations(boulder_id);
    `);
  
      return db;
    }
    
    module.exports = initDb;