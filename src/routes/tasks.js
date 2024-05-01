
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/tasks');
const { db } = require('../db');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
  res.json({ id: this.lastID });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/',authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTaskById);
router.post('/',authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
