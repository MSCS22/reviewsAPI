const router = require('express').Router();
const reviews = require('./reviewsController');


router.get('/hello', async (req, res) => {
  res.send("hello world!");
});
router.get('/', reviews.get);
router.post('/', reviews.post);
router.get('/meta', reviews.getMeta);
router.put('/:reviewID/helpful', reviews.putHelpful);
router.put('/:reviewID/report', reviews.putReport);

module.exports = router;
