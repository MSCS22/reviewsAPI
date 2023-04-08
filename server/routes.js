
const router = require('express').Router();
const reviews = require('./reviewsController');

//const db = require('./db');

// Store data in the database
// router.post('/data', async (req, res) => {
//   const { name, email } = req.body;
//   const result = await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
//   res.send(result.rows);
// });

// // Retrieve data from the database
// router.get('/data', async (req, res) => {
//   const result = await db.query('SELECT * FROM users');
//   res.send(result.rows);
// });
router.get('/hello', async (req, res) => {
  res.send("hello world!");
});
router.get('/', reviews.get);
router.post('/', reviews.post);
router.get('/meta', reviews.getMeta);
router.put('/:reviewID/helpful', reviews.putHelpful);
router.put('/:reviewID/report', reviews.putReport);

module.exports = router;
