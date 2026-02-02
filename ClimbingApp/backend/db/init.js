const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initDb() {
    const db = await open({ filename: './data.db', driver: sqlite3.Database });

  /* =======================
     USERS
  ======================= */
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

  /* =======================
     BOULDERS
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS boulder (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone_id TEXT NOT NULL,
      grade INTEGER NOT NULL,
      color TEXT NOT NULL,
      path TEXT NOT NULL,
      uploaded_by INTEGER,
      wall_type TEXT NOT NULL, -- devers | dalle | vertical

      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      archived_at DATETIME DEFAULT NULL,
      is_current INTEGER NOT NULL DEFAULT 1,

      original_filename TEXT,
      mime_type TEXT,
      filesize INTEGER,

      validations_count INTEGER NOT NULL DEFAULT 0,
      current_point REAL NOT NULL DEFAULT 0,

      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );
  `);


  /* =======================
     HOLD TYPES (CRIMP, PINCH, ...)
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS hold_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );
  `);

  /* =======================
     SKILLS (PHYSIQUE, TECHNIQUE, ...)
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS skill (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );
  `);

  /* =======================
     BOULDER ↔ HOLD TYPE
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS boulder_hold_type (
      boulder_id INTEGER NOT NULL,
      hold_type_id INTEGER NOT NULL,

      PRIMARY KEY (boulder_id, hold_type_id),

      FOREIGN KEY (boulder_id)
        REFERENCES boulder(id)
        ON DELETE CASCADE,

      FOREIGN KEY (hold_type_id)
        REFERENCES hold_type(id)
        ON DELETE CASCADE
    );
  `);

  /* =======================
     BOULDER ↔ SKILL
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS boulder_skill (
      boulder_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,

      PRIMARY KEY (boulder_id, skill_id),

      FOREIGN KEY (boulder_id)
        REFERENCES boulder(id)
        ON DELETE CASCADE,

      FOREIGN KEY (skill_id)
        REFERENCES skill(id)
        ON DELETE CASCADE
    );
  `);

  /* =======================
     COMMENTS
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      boulder_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (boulder_id) REFERENCES boulder(id)
    );
  `);

  /* =======================
     SESSIONS
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,

      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  /* =======================
     BOULDER VALIDATIONS
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS boulder_validations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      boulder_id INTEGER NOT NULL,
      session_id INTEGER,
      validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (user_id, boulder_id),

      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (boulder_id) REFERENCES boulder(id),
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
  `);

  /* =======================
     BOULDER ATTEMPTS
  ======================= */
  // await db.exec(`
  //   CREATE TABLE IF NOT EXISTS boulder_attempts (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     user_id INTEGER NOT NULL,
  //     boulder_id INTEGER NOT NULL,
  //     session_id INTEGER,
  //     attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     success INTEGER NOT NULL DEFAULT 0,

  //     FOREIGN KEY (user_id) REFERENCES users(id),
  //     FOREIGN KEY (boulder_id) REFERENCES boulder(id),
  //     FOREIGN KEY (session_id) REFERENCES sessions(id)
  //   );
  // `);

/* =======================
     VIDEOS
     - Un boulder peut avoir 0..N vidéos
     - Vidéo soit uploadée (fichier), soit lien Instagram
     - La contrainte 'source' garantie qu'au moins un des deux est présent
  ======================= */

  await db.exec(`
    CREATE TABLE IF NOT EXISTS video (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      boulder_id INTEGER NOT NULL,
      uploaded_by INTEGER,
      source TEXT NOT NULL DEFAULT 'upload',
      original_filename TEXT,
      server_filename TEXT,
      mime_type TEXT,
      filesize INTEGER,
      instagram_url TEXT,
      description TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (boulder_id) REFERENCES boulder(id) ON DELETE CASCADE,
      FOREIGN KEY (uploaded_by) REFERENCES users(id),

      CHECK (
        (source = 'instagram' AND instagram_url IS NOT NULL)
        OR
        (source = 'upload' AND original_filename IS NOT NULL)
      )
    );
  `);

/* =======================
     EVENTS
     - image uploadée par l'utilisateur
     - titre, description, date de début/fin
  ======================= */
  await db.exec(`
    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      uploaded_by INTEGER,
      original_filename TEXT,
      server_filename TEXT, 
      mime_type TEXT,
      filesize INTEGER,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (uploaded_by) REFERENCES users(id),

      CHECK (end_date >= start_date)
    );
  `);

  /* =======================
     INDEXES (PERFORMANCE)
  ======================= */
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_bv_user
      ON boulder_validations(user_id);

    CREATE INDEX IF NOT EXISTS idx_bv_boulder
      ON boulder_validations(boulder_id);

    CREATE INDEX IF NOT EXISTS idx_bv_session
      ON boulder_validations(session_id);

    CREATE INDEX IF NOT EXISTS idx_sessions_user_date
      ON sessions(user_id, started_at);
    
    CREATE INDEX IF NOT EXISTS idx_event_start_date
      ON event(start_date);
    
  `);
  

      return db;
    }
    
    module.exports = initDb;