const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const csv = require('csv-parser');
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "reviewsdb",
  password: "MSPG95",
  port: 5432,
});

async function* readCSV(filePath) {
  const stream = fs.createReadStream(filePath).pipe(csv());

  for await (const data of stream) {
    yield data;
  }
}

async function copyData() {
  try {
    await client.connect();
    console.log('Successfully connected to the database!');

    // Read data from reviews.csv
    const filePath = '/Users/majdsaleh/2302/reviews.csv';

    let rowIndex = 0;

    for await (const data of readCSV(filePath)) {
      rowIndex++;

      // Skip rows before 2301654
      if (rowIndex < 2301654) {
        continue;
      }

      // Format the date
      data.date = moment(parseInt(data.date)).format('YYYY-MM-DD');

      // Insert the row into the database
      await client.query(`INSERT INTO reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [data.id, data.product_id, data.rating, data.date, data.summary, data.body, data.recommend, data.reported, data.reviewer_name, data.reviewer_email, data.response, data.helpfulness]);
    }

    console.log('Data successfully copied!');
  } catch (err) {
    console.error('Error copying data:', err);
  } finally {
    await client.end();
  }
}


copyData();
