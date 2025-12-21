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
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}


function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next();
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
          const role = 'user';
          const userId = result.lastID;
          const token = jwt.sign({ userId, email, display_name, role }, JWT_SECRET, { expiresIn: '7d' });
          console.log("serv.js : end", token)
          res.json({ token, user: { id: userId, email, display_name, role } });

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
        const token = jwt.sign({ userId: user.id, email, display_name: user.display_name, role}, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email, display_name: user.display_name, role } });
        console.log("server.js : end login ")
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
    
    // Récupère tous les commentaires
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
        console.log('server.js : POST /api/boulders');
        const file = req.file;
        const { zoneId, grade, color } = req.body || {};
    
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!zoneId || !grade || !color) {
          try { fs.unlinkSync(file.path); } catch (e) { console.warn('unable to delete', e); }
          return res.status(400).json({ error: 'Missing zoneId, grade or color' });
        }

        const storedPath = path.relative(__dirname, file.path).replace(/\\/g, '/');
    
        const uploadedBy = req.user?.userId || null;
    
        const sql = `
          INSERT INTO boulder (zone_id, grade, color, path, uploaded_by, original_filename, mime_type, filesize)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
          zoneId,
          parseInt(grade, 10),
          color,
          storedPath,
          uploadedBy,
          file.originalname,
          file.mimetype,
          file.size,
        ];
    
        const result = await db.run(sql, params);
        const insertedId = result.lastID;
    
        return res.status(201).json({
          success: true,
          id: insertedId,
          path: storedPath,
          original_filename: file.originalname,
        });
      } catch (err) {
        console.error('Error in POST /api/images', err);
        return res.status(500).json({ error: 'Server error' });
      }
    });

    app.get('/api/boulders', async (req, res) => {
      console.log("GET /api/boulders (public + optional user)");
    
      try {
        // let userId = null;
    
        // // Vérifier si un token existe dans les headers (sans obliger)
        // const authHeader = req.headers.authorization;
        // if (authHeader && authHeader.startsWith("Bearer ")) {
        //   const token = authHeader.split(" ")[1];
        //   try {
        //     const decoded = jwt.verify(token, JWT_SECRET);
        //     userId = decoded.userId;
        //   } catch (err) {
        //     // Token invalide → ignore, accès public
        //     console.log("Invalid token, continuing as guest");
        //   }
        // }
    
        const boulders = await db.all(`
          SELECT *
          FROM boulder`);
        res.json({ boulders });
        
      } catch (err) {
        console.error("Error fetching boulders:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    

    app.get('/api/boulders/validated', auth, async (req, res) => {
      console.log("GET /api/boulders/validated");
    
      try {
        const userId = req.user.userId;
        if (!userId) {
          return res.json({ boulders: [] });
        } else {
          const boulders = await db.all(`
            SELECT boulder.*
            FROM boulder
            JOIN boulder_validations iv ON iv.boulder_id = boulder.id
            WHERE iv.user_id = ?
          `, [userId]);
      
          res.json({ boulders });
        }
      } catch (err) {
        console.error("Error fetching validated boulders:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post('/api/boulders/toggle-validation', auth, async (req, res) => {
      console.log("POST /api/boulders/toggle-validation");
      try {
        const userId = req.user.userId;
        const boulderId = req.body.boulder;
        if (!boulderId) {
          return res.status(400).json({ error: "Missing boulder id" });
        }
        const exists = await db.get(`
          SELECT 1 FROM boulder_validations
          WHERE user_id = ? AND boulder_id = ?
        `, [userId, boulderId]);
        if (exists) {
          await db.run(`
            DELETE FROM boulder_validations
            WHERE user_id = ? AND boulder_id = ?
          `, [userId, boulderId]);
    
          return res.json({ validated: false });
        }
        await db.run(`
          INSERT INTO boulder_validations (user_id, boulder_id)
          VALUES (?, ?)
        `, [userId, boulderId]);
    
        res.json({ validated: true });
    
      } catch (err) {
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
    
        // Récupère le commentaire
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
    

  app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
    
}
)();