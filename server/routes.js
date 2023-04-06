const express = require('express');
const router = express.Router();
const db = require('./db');

// Store data in the database
router.post('/data', async (req, res) => {
  const { name, email } = req.body;
  const result = await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
  res.send(result.rows);
});

// Retrieve data from the database
router.get('/data', async (req, res) => {
  const result = await db.query('SELECT * FROM users');
  res.send(result.rows);
});
router.get('/', async (req, res) => {
  res.send("hello world!");
});

module.exports = router;
