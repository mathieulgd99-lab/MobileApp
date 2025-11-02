// Fichier qui s'occupe de faire les appels à la data base initialisée avec db/init.js


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const initDb = require('./db/init');
const status = require('http-status')

const app = express();
app.use(cors());
app.use(express.json());

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

// curl -v -X POST http://localhost:3000/api/register \
//   -H "Content-Type: application/json" \
//   -d '{"email":"test@example.com","password":"azerty123","display_name":"TestUser"}'

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
          console.log("serv.js : end")
          res.json({ token, user: { id: userId, email, display_name, role } });

        } catch (err) {
          console.log("error during try")
          res.status(400).json({ error: 'User exists' });
        }
      });

    app.post('/api/login', async (req,res) => {
        console.log("server.js : start login ")
        const { email, password } = req.body || {};
        if (!email || !password) {
          return res.status(400).json({ error: `You must specify email and password : ${email} - ${password}` });
        }
        console.log("server.js : selecting in db ")
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        console.log("server.js : finish selecting in db ")
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
  
  //   app.post('/api/comment', async (req,res) => {
  //     const {email, message, boulderId} = req.body;
  //     const userId = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  //     try {
  //       const result = await db.run('INSERT INTO comments (user_id,block_id,content) VALUES (?,?,?)', [userId, boulderId, message])


  //       const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  //       res.json({ token, user: { id: user.id, email, display_name: user.display_name } });
  //     } catch (err) {
  //       res.status(400).json({ error: 'Invalid comment'});
  //     }

  // })

  // app.get('api/comment/:bloc_id', async (req,res) => {

  // })

  // // To mark a boulder as did
  // app.get('api/progress/:bloc_id', async (req,res) => {

  // })

  app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
    
}
)();