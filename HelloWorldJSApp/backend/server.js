require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const initDb = require('./db/init');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

function auth(req, res, next) {

}


(async () => {
    const db = await initDb();
    app.post('/api/register', async (req, res) => {
        const { email, password, display_name } = req.body;
        const hash = await bcrypt.hash(password, 10);
        try {
          const result = await db.run('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)', [email, hash, display_name]);
          const userId = result.lastID;
          const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
          res.json({ token, user: { id: userId, email, display_name } });
        } catch (err) {
          res.status(400).json({ error: 'User exists' });
        }
      });

    app.post('/api/login', async (req,res) => {
        const {email, password} = req.body;
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ error: 'Invalid email' });
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid password'})
        const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email, display_name: user.display_name } });
    })
    
}
)