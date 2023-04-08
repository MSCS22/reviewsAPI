const client = require('./db');
const moment = require('moment');

module.exports = {
  get: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const count = parseInt(req.query.count) || 5;
        let sort = req.query.sort || 'id';
        const product_id = parseInt(req.query.product_id);

        if(sort === 'newest') {
          sort = 'date'
        }
        // await client.connect();
        // console.log('Successfully connected to the database!');

        // Validate the sort parameter against a list of allowed column names
        const allowedSortColumns = ['id', 'rating', 'date', 'helpfulness'];
        if (!allowedSortColumns.includes(sort)) {
          return res.status(400).send({ error: 'Invalid sort parameter' });
        }

        // Use the product_id, page, count, and sort parameters in your SQL query
        const offset = (page - 1) * count;
        const query = `
          SELECT reviews.*, coalesce(json_agg(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) FILTER (WHERE reviews_photos.review_id IS NOT NULL), '[]') as photos
          FROM reviews
          LEFT JOIN reviews_photos ON reviews.review_id = reviews_photos.review_id
          WHERE reviews.product_id = $1
          GROUP BY reviews.review_id, reviews_photos.id
          ORDER BY ${sort} DESC
          LIMIT $2 OFFSET $3
        `;

        const values = [product_id, count, offset];
        const reviewsResult = await client.query(query, values);
        reviewsResult.rows.forEach((el)=>el.date=moment(parseInt(el.date)).format('YYYY-MM-DD'))
        const responseObj = {
          product: product_id,
          page: page,
          count: count,
          result: reviewsResult.rows
        }
        res.send(responseObj);
        // await client.end();
  },
  getMeta: async (req, res) => {
    const product_id = req.query.product_id;

  },
  post: async (req, res) => {
    const product_id = req.query.product_id;

  },
  putHelpful: async (req, res) => {
    const reviewID = parseInt(req.params.reviewID);

    if (!reviewID) {
      return res.status(400).send({ error: 'Invalid or missing reviewID parameter' });
    }

    const query = `
      UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE review_id = $1
    `;
    const values = [reviewID];

    try {
      await client.query(query, values);
      res.status(200).send({ message: 'Review marked helpful' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error updating helpfulness for review' });
    }


  },
  putReport: async (req, res) => {
    const reviewID = parseInt(req.params.reviewID);
    console.log(req.params.reviewID)
    if (!reviewID) {
      return res.status(400).send({ error: 'Invalid or missing reviewID parameter' });
    }

    const query = `
      DELETE FROM reviews
      WHERE review_id = $1
    `;
    const values = [reviewID];

    try {
      const result = await client.query(query, values);
      if (result.rowCount > 0) {
        res.status(200).send({ message: 'Review reported successfully' });
      } else {
        res.status(404).send({ error: 'Review not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error deleting review' });
    }
  },
};
