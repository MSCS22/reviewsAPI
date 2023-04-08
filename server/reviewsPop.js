const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "reviewsdb",
  password: "MSPG95",
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

const results = [];

fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews2.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Transform the data here as needed
    const transformedData = {
      id: data.id,
      product_id: data.product_id,
      rating: data.rating,
      date: moment(parseInt(data.date)).format('YYYY-MM-DD'),
      summary: data.summary.replace(/'/g, "''"),
      body: data.body.replace(/'/g, "''"),
      recommend: data.recommend,
      reported: data.reported,
      reviewer_name: data.reviewer_name.replace(/'/g, "''"),
      reviewer_email: data.reviewer_email,
      response: data.response.replace(/'/g, "''"),
      helpfulness: data.helpfulness
    };

    results.push(transformedData);
  })
  .on('end', () => {
    //Load the data into PostgreSQL

    const query = `
      INSERT INTO reviews (review_id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
      VALUES
        ${results.map((data) => `(${data.id}, ${data.product_id}, '${data.rating}', '${data.date}', '${data.summary}', '${data.body}', ${data.recommend}, ${data.reported}, '${data.reviewer_name}', '${data.reviewer_email}', E'${data.response.replace(/'/g, "''")}', ${data.helpfulness})`).join(',')}
    `;

    console.log('query', query);

    pool.query(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Data successfully loaded into PostgreSQL');
      pool.end();
    });
  });
