const pool = require('./db');
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
          WHERE reviews.product_id = $1 AND NOT reviews.reported
          GROUP BY reviews.review_id, reviews_photos.id
          ORDER BY ${sort} DESC
          LIMIT $2 OFFSET $3

        `;

        const values = [product_id, count, offset];
        const reviewsResult = await pool.query(query, values);
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
    const product_id = parseInt(req.query.product_id);
    const ratingsQuery = `
      SELECT rating, recommend
      FROM reviews
      WHERE product_id = $1
      `;
      ratingValues = [product_id];
    const ratingsResult = await pool.query(ratingsQuery, ratingValues);

    let ratingsObj = {};
    let recommendObj = {
      "false": 0,
      "true": 0
    };

    ratingsResult.rows.forEach( (el) => {
      if (!ratingsObj[el.rating]){
        ratingsObj[el.rating]=1
      }
      else if (ratingsObj[el.rating]){
        ratingsObj[el.rating]+=1
      }
      if (el.recommend){
        recommendObj.true+=1;
      }
      else if (!el.recommend) {
        recommendObj.false+=1;
      }

    })

    const characteristicsQuery = `SELECT  characteristics.id, characteristics.name, characteristic_reviews.value
    FROM characteristics
    JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristic_id
    WHERE characteristics.product_id = ${product_id}`;

    const charResult = await pool.query(characteristicsQuery);
    const charObj = {};
    let charsCount = 0
    charResult.rows.forEach((el)=> {

      if(!charObj[el.name]) {
        charsCount +=1;
        charObj[el.name]={
          id: el.id,
          value: el.value
        }
      } else if(charObj[el.name]) {
        charObj[el.name].value+=el.value
      }
    })

    // dividing value by the number of characteristcs get the average value
    for (let key in charObj) {
      charObj[key].value = charObj[key].value/charsCount;
    }

    const responseObj = {
      product_id: product_id,
      ratings: ratingsObj,
      recommended: recommendObj,
      characteristics:charObj
    }
    res.send(responseObj);
  },
  post: async (req, res) => {
    // extract the data from the post request body
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
    const date = moment().valueOf(); // convert the date to the required format

    // construct the SQL query to insert a new row into the reviews table
    const query = {
      text: `
        INSERT INTO reviews (
          review_id, product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, helpfulness
        ) VALUES (
          (SELECT COALESCE(MAX(review_id), 0) + 1 FROM reviews),
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) RETURNING review_id
      `,
      values: [product_id, rating, date, summary, body, recommend, name, email, 0],
    };

    // execute the SQL query and store the newly created review_id as a constant
    let review_id;
    try {
      const res = await pool.query(query);
      review_id = res.rows[0].review_id;
      console.log('New review created with ID:', review_id);
    } catch (err) {
      console.error('Error executing insert query into reviews table', err);
    }
      // inserting intro characteristic_reviews
      let char_id;
      let value;
      const charsReviewsQuery = {
        text: `
          INSERT INTO characteristic_reviews (id, characteristic_id, review_id, value)
          VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM characteristic_reviews), $1, $2, $3)
        `,
        values: [char_id, review_id, value],
      };


      for (let key in characteristics) {
        char_id = key;
        value = characteristics[key];
        charsReviewsQuery.values = [char_id, review_id, value];
        await pool.query(charsReviewsQuery);
      }
      // inserting intro reviews_photos
      let url;
      const ReviewsPhotosQuery = {
        text: `INSERT INTO reviews_photos(id, review_id, url)
               VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM reviews_photos), $1, $2)`,
        values: [review_id, url],
      };

      photos.forEach( (el) => {
        url=el;
        pool.query(ReviewsPhotosQuery)
      })



    res.send('post sucessful')

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
      await pool.query(query, values);
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
    UPDATE reviews
    SET reported = true
    WHERE review_id = $1
    `;
    const values = [reviewID];

    try {
      const result = await pool.query(query, values);
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
