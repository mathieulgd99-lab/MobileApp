// Fichier qui s'occupe de faire les appels à la data base initialisée avec db/init.js


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const initDb = require('./db/init');
const status = require('http-status')

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(">>> SERVER RECEIVED:", req.method, req.url);
  next();
});

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send('No token');
  const token = header.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // req.user = payload;
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).send('Forbidden');
}

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

async function getOrCreateTodaySession(db, userId) {
  const session = await db.get(`
    SELECT id
    FROM sessions
    WHERE user_id = ?
      AND date(started_at) = date('now')
    LIMIT 1
  `, [userId]);

  if (session) return session.id;

  const result = await db.run(`
    INSERT INTO sessions (user_id)
    VALUES (?)
  `, [userId]);

  return result.lastID;
}

(async () => {
    const db = await initDb();


    app.post('/api/register', async (req, res) => {
        console.log("server.js : start register ")
        const { email, password, display_name } = req.body || {};
        if (!email || !password || !display_name) {
          console.log("error, invalid args")
          return res.status(400).json({ error: `You must specify email and password : ${email} - ${password} - ${display_name}` });
        }
        const hash = await bcrypt.hash(password, 10);
        try {
          const result = await db.run('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)', [email, hash, display_name]);

          const userId = result.lastID;
          const user = await db.get('SELECT id, email, display_name, role, total_points, created_at FROM users WHERE id = ?', [userId]);
          const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
          console.log("serv.js : end", token)
          res.json({ token, user });
        } catch (err) {
          console.error("error during try")
          res.status(400).json({ error: 'User exists' });
        }
      });

    app.post('/api/login', async (req,res) => {
        console.log("server.js : start login ")
        const { email, password } = req.body || {};
        if (!email || !password) {
          return res.status(400).json({ error: `You must specify email and password : ${email} - ${password}` });
        }
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ error: 'Invalid email' });
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid password'})
        const role = user.role || 'user';
        const token = jwt.sign({ userId: user.id, email, role}, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email, display_name: user.display_name, role, created_at: user.created_at } });
        console.log("server.js : end login ")
    });

    app.post('/api/change/password', auth, async (req, res) => {
      console.log("server.js : start change pw");
    
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ error: 'You must specify new password' });
      }
    
      // if (newPassword.length < 6) {
      //   return res.status(400).json({ error: 'Password too short (min 6)' });
      // }
    
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await db.run(
          `UPDATE users SET password_hash = ? WHERE id = ?`,
          [hashedPassword, req.user.id]
        );
    
        console.log("server.js : end change pw");
        res.json({ success: true });
      } catch (err) {
        console.error('change password error', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    app.post('/api/change/username', auth, async (req, res) => {
      console.log("server.js : start change username");
    
      const { newUsername } = req.body;
      console.log("New username : ", newUsername)
      if (!newUsername) {
        return res.status(400).json({ error: 'You must specify new username' });
      }
    
      // if (newUsername.length < 3) {
      //   return res.status(400).json({ error: 'Username too short (min 3)' });
      // }
    
      try {
        await db.run(
          `UPDATE users SET display_name = ? WHERE id = ?`,
          [newUsername, req.user.id]
        );

        const updatedUser = await db.get(
          `SELECT id, email, display_name, role, created_at
           FROM users WHERE id = ?`,
          [req.user.id]
        );
        console.log("server.js : end change username");
        res.json({ success: true, user: updatedUser });
      } catch (err) {
        console.error('change username error', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    app.get('/api/all_users', async (req, res) => {
      try {
        console.log("server.js : selecting all users");
        const all = await db.all('SELECT * FROM users');
        res.json(all);
      } catch (err) {
        console.error("server.js : error fetching users", err);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });
    
    app.get('/api/all_comments', async (req, res) => {
      try {
        console.log("server.js : selecting all comments");
        const all = await db.all('SELECT * FROM comments');
        res.json(all);
      } catch (err) {
        console.error("server.js : error fetching comments", err);
        res.status(500).json({ error: "Failed to fetch comments" });
      }
    });

    app.post('/api/boulders', auth, requireAdmin, upload.single('boulder'), async (req, res) => {
      try {
        console.log('POST /api/boulders');
    
        const file = req.file;
        const {
          zoneId,
          grade,
          color,
          wallType,
          holds = [],
          skills = []
        } = req.body || {};
    
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        if (!zoneId || !grade || !color || !wallType) {
          try { fs.unlinkSync(file.path); } catch {}
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        const storedPath = path.relative(__dirname, file.path).replace(/\\/g, '/');
        const uploadedBy = req.user?.userId || null;
    
        await db.exec('BEGIN TRANSACTION');
    
        /* ---------- BOULDER ---------- */
        const result = await db.run(
          `
          INSERT INTO boulder (
            zone_id, grade, color, path, uploaded_by,
            wall_type, original_filename, mime_type, filesize
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            zoneId,
            parseInt(grade, 10),
            color,
            storedPath,
            uploadedBy,
            wallType,
            file.originalname,
            file.mimetype,
            file.size
          ]
        );
    
        const boulderId = result.lastID;
    
        /* ---------- HOLDS ---------- */
        for (const holdName of [].concat(holds)) {
          const hold = await db.get(
            `SELECT id FROM hold_type WHERE name = ?`,
            [holdName]
          );
    
          if (hold) {
            await db.run(
              `INSERT INTO boulder_hold_type (boulder_id, hold_type_id)
               VALUES (?, ?)`,
              [boulderId, hold.id]
            );
          }
        }

        /* ---------- SKILLS ---------- */
        for (const skillName of [].concat(skills)) {
          const skill = await db.get(
            `SELECT id FROM skill WHERE name = ?`,
            [skillName]
          );
    
          if (skill) {
            await db.run(
              `INSERT INTO boulder_skill (boulder_id, skill_id)
               VALUES (?, ?)`,
              [boulderId, skill.id]
            );
          }
        }
    
        await db.exec('COMMIT');
    
        res.status(201).json({
          success: true,
          id: boulderId,
          path: storedPath
        });
    
      } catch (err) {
        await db.exec('ROLLBACK');
        console.error('Error creating boulder:', err);
        res.status(500).json({ error: 'Server error' });
      }
    });
    

    app.get('/api/boulders', async (req, res) => {
      try {
        const boulders = await db.all(`
          SELECT
            b.*,
            GROUP_CONCAT(DISTINCT ht.name) AS holds,
            GROUP_CONCAT(DISTINCT s.name) AS skills
          FROM boulder b
          LEFT JOIN boulder_hold_type bht ON b.id = bht.boulder_id
          LEFT JOIN hold_type ht ON ht.id = bht.hold_type_id
          LEFT JOIN boulder_skill bs ON b.id = bs.boulder_id
          LEFT JOIN skill s ON s.id = bs.skill_id
          GROUP BY b.id
          ORDER BY b.added_at DESC
        `);
    
        res.json({
          boulders: boulders.map(b => ({
            ...b,
            holds: b.holds ? b.holds.split(',') : [],
            skills: b.skills ? b.skills.split(',') : []
          }))
        });
    
      } catch (err) {
        console.error("Error fetching boulders:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    

    app.get('/api/boulders/validated', auth, async (req, res) => {
      try {
        const userId = req.user.id;
    
        const boulders = await db.all(`
          SELECT
            b.*,
            GROUP_CONCAT(DISTINCT ht.name) AS holds,
            GROUP_CONCAT(DISTINCT s.name) AS skills
          FROM boulder b
          JOIN boulder_validations bv ON bv.boulder_id = b.id
          LEFT JOIN boulder_hold_type bht ON b.id = bht.boulder_id
          LEFT JOIN hold_type ht ON ht.id = bht.hold_type_id
          LEFT JOIN boulder_skill bs ON b.id = bs.boulder_id
          LEFT JOIN skill s ON s.id = bs.skill_id
          WHERE bv.user_id = ?
          GROUP BY b.id
        `, [userId]);
    
        res.json({
          boulders: boulders.map(b => ({
            ...b,
            holds: b.holds ? b.holds.split(',') : [],
            skills: b.skills ? b.skills.split(',') : []
          }))
        });
    
      } catch (err) {
        console.error("Error fetching validated boulders:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post('/api/boulders/toggle-validation', auth, async (req, res) => {
      console.log("POST /api/boulders/toggle-validation");
      console.log("req.user =", req.user);
      const userId = req.user.id;
      const boulderId = req.body.boulder;
    
      if (!boulderId) {
        return res.status(400).json({ error: "Missing boulder id" });
      }
    
      try {
        await db.exec('BEGIN TRANSACTION;');
    
        const existing = await db.get(
          `SELECT 1 FROM boulder_validations WHERE user_id = ? AND boulder_id = ?`,
          [userId, boulderId]
        );
    
        const boulder = await db.get(
          `SELECT validations_count FROM boulder WHERE id = ?`,
          [boulderId]
        );
    
        if (!boulder) {
          await db.exec('ROLLBACK;');
          return res.status(404).json({ error: "Boulder not found" });
        }
    
        const oldCount = boulder.validations_count;
        const oldPoint = oldCount > 0 ? Math.floor(1000 / oldCount) : 0;
    
        // 
        // Enlever une validation
        //
        if (existing) {
          const newCount = oldCount - 1;
          const newPoint = newCount > 0 ? Math.floor(1000 / newCount) : 0;
          const delta = newPoint - oldPoint;
    
          await db.run(
            `DELETE FROM boulder_validations WHERE user_id = ? AND boulder_id = ?`,
            [userId, boulderId]
          );

          await db.run(
            `UPDATE boulder
             SET validations_count = ?, current_point = ?
             WHERE id = ?`,
            [newCount, newPoint, boulderId]
          );
    
          // utilisateurs restants gagnent des points
          if (newCount > 0) {
            await db.run(
              `UPDATE users
               SET total_points = total_points + ?
               WHERE id IN (
                 SELECT user_id FROM boulder_validations WHERE boulder_id = ?
               )`,
              [delta, boulderId]
            );
          }
    
          // retirer les points de l'utilisateur
          await db.run(
            `UPDATE users SET total_points = total_points - ? WHERE id = ?`,
            [oldPoint, userId]
          );
    
          await db.exec('COMMIT;');
          return res.json({ validated: false });
        }
    
        // 
        // AJOUTER UNE VALIDATION
        // 
        const newCount = oldCount + 1;
        const newPoint = Math.floor(1000 / newCount);
        const delta = newPoint - oldPoint;
        const sessionId = await getOrCreateTodaySession(db, userId);

        await db.run(
          `INSERT INTO boulder_validations (user_id, boulder_id, session_id)
           VALUES (?, ?, ?)`,
          [userId, boulderId, sessionId]
        );
        await db.run(
          `UPDATE boulder
           SET validations_count = ?, current_point = ?
           WHERE id = ?`,
          [newCount, newPoint, boulderId]
        );
    
        // anciens validateurs perdent des points
        if (oldCount > 0) {
          await db.run(
            `UPDATE users
             SET total_points = total_points + ?
             WHERE id IN (
               SELECT user_id FROM boulder_validations
               WHERE boulder_id = ? AND user_id != ?
             )`,
            [delta, boulderId, userId]
          );
        }
    
        // nouvel utilisateur gagne ses points
        await db.run(
          `UPDATE users SET total_points = total_points + ? WHERE id = ?`,
          [newPoint, userId]
        );
    
        await db.exec('COMMIT;');
        res.json({ validated: true });
    
      } catch (err) {
        await db.exec('ROLLBACK;');
        console.error("Error toggling validation:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    

    app.get('/api/comment/:boulderId', auth, async (req,res) => {
      try {
        const boulderId = req.params.boulderId;
        if (!boulderId) return res.status(400).json({ error: 'Missing boulderId' });

        const comments = await db.all('SELECT * from comments WHERE boulder_id = ? ', [boulderId]);

        res.json({comments})

      } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.post('/api/comment/:boulderId', auth, async (req, res) => {
      try {
        const userId = req.user.userId;
        const userName = req.user.display_name
        const boulderId = req.params.boulderId;
        const content = (req.body.comment ?? '').trim();
        console.log("POST /api/comment", { userId, userName, boulderId, content });
        if (!boulderId) {
          return res.status(400).json({ error: 'Missing boulder id' });
        }
        if (!content) {
          return res.status(400).json({ error: 'Missing comment' });
        }
        if (content.length > 1000) {
          return res.status(400).json({ error: 'Comment too long (max 1000 chars)' });
        }
    
        const result = await db.run(
          `INSERT INTO comments (user_id, user_name, boulder_id, content) VALUES (?, ?, ?, ?)`,
          [userId, userName, boulderId, content]
        );

        const insertedId = result?.lastID;
        let insertedRow = null;
        if (insertedId) {

          insertedRow = await db.get(`SELECT id, user_id, boulder_id AS boulder, content, created_at FROM comments WHERE id = ?`, [insertedId]);
        } else {

          // fallback : récupérer le dernier commentaire de cet utilisateur sur ce bloc (moins fiable en cas de concurrence)
          insertedRow = await db.get(
            `SELECT id, user_id, boulder_id AS boulder, content, created_at
             FROM comments
             WHERE user_id = ? AND boulder_id = ?
             ORDER BY id DESC
             LIMIT 1`,
            [userId, boulderId]
          );
        }
    
        return res.status(201).json({ success: true, comment: insertedRow });
      } catch (err) {
        console.error('Error posting comment:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/api/comment/:commentId', auth, async (req, res) => {
      try {
        console.log("serv: DELETE /api/comment/:commentId hit");
        const commentId = parseInt(req.params.commentId, 10);
        if (!commentId) {
          return res.status(400).json({ error: 'Invalid comment id' });
        }
    
        const comment = await db.get(`SELECT id, user_id, boulder_id, content, created_at FROM comments WHERE id = ?`, [commentId]);
        if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
        }
    
        const requesterId = req.user.userId;
        const requesterRole = req.user.role;
        const isOwner = requesterId === comment.user_id;
        const isAdmin = requesterRole === 'admin';
    
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ error: 'Forbidden: not allowed to delete this comment' });
        }
    
        await db.run(`DELETE FROM comments WHERE id = ?`, [commentId]);
    
        return res.json({ success: true, deletedId: commentId });
      } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/api/boulders/:boulderId', auth, requireAdmin, async (req,res) => {
      try {
        console.log("serv: DELETE /api/boulders/:boulderId hit");
        const boulderId = parseInt(req.params.boulderId, 10);
        if (!boulderId) {
          return res.status(400).json({ error: 'Invalid boulder id' });
        }
    
        const isAdmin = req.user.role === 'admin';
    
        if (!isAdmin) {
          return res.status(403).json({ error: 'Forbidden: not allowed to delete this boulder' });
        }
    
        await db.run(`DELETE FROM boulder WHERE id = ?`, [boulderId]);
    
        return res.json({ success: true, deletedId: boulderId });
      } catch (err) {
        console.error('Error deleting boulder:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/api/boulders/archived/:boulderId', auth, requireAdmin, async (req, res) => {
      try {
        const boulderId = req.params.boulderId;
        if (!boulderId) return res.status(400).json({ error: "Missing boulder id" });
    
        const result = await db.run(
          `UPDATE boulder
           SET archived_at = CASE WHEN archived_at IS NULL THEN datetime('now') ELSE NULL END
           WHERE id = ?`,
          [boulderId]
        );

        const updated = await db.get(
          `SELECT archived_at FROM boulder WHERE id = ?`,
          [boulderId]
        );
    
        res.json({
          archived: updated.archived_at !== null,
          archived_at: updated.archived_at
        });
    
      } catch (err) {
        console.error("Error toggling archived:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    app.get('/api/points/:userId', auth, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        if (!userId) {
          return res.status(400).json({ error: "Missing or invalid user id" });
        }
    
        const row = await db.get(
          `SELECT total_points FROM users WHERE id = ?`,
          [userId]
        );
    
        if (!row) {
          return res.status(404).json({ error: "User not found" });
        }
    
        res.json({
          total_points: row.total_points
        });
    
      } catch (err) {
        console.error("Error get total points:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get('/api/leaderboard', auth, async (req, res) => {
      try {
        const users = await db.all(
          `SELECT id, display_name, total_points
           FROM users
           ORDER BY total_points DESC`
        );
    
        res.json(users);
    
      } catch (err) {
        console.error("Error get leaderboard:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.get('/api/users/:userId', auth, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        if (!userId) {
          return res.status(400).json({ error: 'Missing or invalid user id' });
        }
    
        const user = await db.get(
          `SELECT id, email, display_name, role, total_points, created_at
           FROM users
           WHERE id = ?`,
          [userId]
        );
    
        if (!user) return res.status(404).json({ error: 'User not found' });
    
        const requesterId = req.user.userId;
        const requesterRole = req.user.role;
    
        if (requesterId !== userId && requesterRole !== 'admin') {
          delete user.email;
        }
    
        res.json({ user });
      } catch (err) {
        console.error('Error get user by id:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    

    app.get('/api/users/:userId/boulders', auth, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        if (!userId) {
          return res.status(400).json({ error: 'Invalid user id' });
        }
    
        const boulders = await db.all(
          `
          SELECT boulder.*
          FROM boulder
          JOIN boulder_validations bv
            ON bv.boulder_id = boulder.id
          WHERE bv.user_id = ?
          `,
          [userId]
        );
    
        res.json({ boulders });
      } catch (err) {
        console.error('Error fetching validated boulders for user:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    app.get('/api/users/:userId/stats/sessions-calendar', auth, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        const { month } = req.query;
    
        const days = await db.all(`
          SELECT
            date(started_at) AS day
          FROM sessions
          WHERE user_id = ?
            AND strftime('%Y-%m', started_at) = ?
          GROUP BY day
        `, [userId, month]);
    
        res.json({
          month,
          days: days.map(d => d.day),
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/api/users/:userId/stats/sessions-timeline', auth, async (req, res) => {
      try {
        const userId = Number(req.params.userId);
        const { range = 'month' } = req.query;
    
        let groupBy;
    
        if (range === 'week') {
          groupBy = "strftime('%Y-%W', started_at)";
        } else if (range === 'year') {
          groupBy = "strftime('%Y-%m', started_at)";
        } else if (range === 'all') {
          groupBy = "strftime('%Y', started_at)";
        } else {
          // month
          groupBy = "strftime('%Y-%m-%d', started_at)";
        }
    
        const data = await db.all(`
          SELECT
            ${groupBy} AS period,
            COUNT(*) AS sessions
          FROM sessions
          WHERE user_id = ?
          GROUP BY period
          ORDER BY period ASC
        `, [userId]);
    
        res.json({ range, data });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/api/users/:userId/stats/difficulties',auth, async (req, res) => {
        try {
          const { userId } = req.params;
          const { range, month } = req.query;
    
          let whereClause = 'bv.user_id = ?';
          const params = [userId];
    
          // 🔍 Filtrage temporel
          if (range === 'month' && month) {
            whereClause += ` AND strftime('%Y-%m', s.started_at) = ?`;
            params.push(month);
          }
    
          if (range === 'year') {
            whereClause += ` AND strftime('%Y', s.started_at) = ?`;
            params.push(dayjs().format('YYYY'));
          }
    
          // all → pas de filtre date
    
          const rows = await db.all(
            `
            SELECT
              b.grade,
              COUNT(*) AS count
            FROM boulder_validations bv
            JOIN boulder b ON b.id = bv.boulder_id
            LEFT JOIN sessions s ON s.id = bv.session_id
            WHERE ${whereClause}
            GROUP BY b.grade
            ORDER BY b.grade
            `,
            params
          );
    
          return res.json({
            data: rows
          });
    
        } catch (err) {
          console.error('Difficulty stats error:', err);
          res.status(500).json({ error: 'Server error' });
        }
      }
    );

    app.get('/api/boulders/:boulderId/videos', auth, async (req, res) => {
      try {
        const boulderId = Number(req.params.boulderId);
        if (!boulderId) {
          return res.status(400).json({ error: 'Invalid boulder id' });
        }
    
        const videos = await db.all(
          `
          SELECT video.*, users.display_name AS uploaded_by_name
          FROM video
          LEFT JOIN users ON users.id = video.uploaded_by
          WHERE video.boulder_id = ?
          ORDER BY video.uploaded_at DESC
          `,
          [boulderId]
        );
    
        res.json({ videos });
      } catch (err) {
        console.error('Error fetching videos:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/api/boulders/:boulderId/videos', auth, async (req, res) => {
      try {
        const boulderId = Number(req.params.boulderId);
        const userId = req.user.id;
    
        if (!boulderId) {
          return res.status(400).json({ error: 'Invalid boulder id' });
        }
    
        const {
          source = 'upload',
          instagram_url,
          description,
          original_filename,
          mime_type,
          filesize
        } = req.body;
    
        await db.run(
          `
          INSERT INTO video (
            boulder_id,
            uploaded_by,
            source,
            instagram_url,
            original_filename,
            mime_type,
            filesize,
            description
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            boulderId,
            userId,
            source,
            instagram_url || null,
            original_filename || null,
            mime_type || null,
            filesize || null,
            description || null
          ]
        );
    
        res.status(201).json({ success: true });
      } catch (err) {
        console.error('Error creating video:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/api/videos/:videoId', auth, async (req, res) => {
      try {
        const videoId = Number(req.params.videoId);
        const userId = req.user.id;
    
        if (!videoId) {
          return res.status(400).json({ error: 'Invalid video id' });
        }
    
        const video = await db.get(
          `SELECT * FROM video WHERE id = ?`,
          [videoId]
        );
    
        if (!video) {
          return res.status(404).json({ error: 'Video not found' });
        }
    
        if (video.uploaded_by !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Forbidden' });
        }
    
        await db.run(`DELETE FROM video WHERE id = ?`, [videoId]);
    
        res.json({ success: true });
      } catch (err) {
        console.error('Error deleting video:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/api/events', async (req, res) => {
      try {
        const events = await db.all(
          `
          SELECT event.*, users.display_name AS uploaded_by_name
          FROM event
          LEFT JOIN users ON users.id = event.uploaded_by
          ORDER BY start_date ASC
          `
        );
    
        res.json({ events });
      } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/api/events', requireAdmin,auth, async (req, res) => {
      try {
        const userId = req.user.id;
        const {
          title,
          description,
          start_date,
          end_date,
          original_filename,
          mime_type,
          filesize
        } = req.body;
    
        if (!title || !start_date || !end_date) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        await db.run(
          `
          INSERT INTO event (
            title,
            description,
            uploaded_by,
            original_filename,
            mime_type,
            filesize,
            start_date,
            end_date
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            title,
            description || null,
            userId,
            original_filename || null,
            mime_type || null,
            filesize || null,
            start_date,
            end_date
          ]
        );
    
        res.status(201).json({ success: true });
      } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.delete('/api/events/:eventId', requireAdmin, auth, async (req, res) => {
      try {
        const eventId = Number(req.params.eventId);
        const userId = req.user.id;
    
        if (!eventId) {
          return res.status(400).json({ error: 'Invalid event id' });
        }
    
        const event = await db.get(
          `SELECT * FROM event WHERE id = ?`,
          [eventId]
        );
    
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }
    
        if (event.uploaded_by !== userId && req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Forbidden' });
        }
    
        await db.run(`DELETE FROM event WHERE id = ?`, [eventId]);
    
        res.json({ success: true });
      } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    
    
  
  app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
    
}
)();