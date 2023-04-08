const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "reviewsdb",
  password: "MSPG95",
  port: 5432,
});

async function copyData() {
  try {
    await client.connect();
    console.log('Successfully connected to the database!');

    // Create a temporary table with the date column as a bigint
    await client.query(`CREATE TEMP TABLE temp_reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      date TIMESTAMP,
      summary VARCHAR(255),
      body TEXT,
      recommend BOOLEAN DEFAULT false,
      reported BOOLEAN DEFAULT false,
      reviewer_name VARCHAR(100),
      reviewer_email VARCHAR(255),
      response TEXT DEFAULT NULL,
      helpfulness INTEGER DEFAULT 0
    );`);

    // Copy data from reviews.csv to the temporary table
    await client.query(`COPY temp_reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
      ) FROM '/Users/majdsaleh/2302/reviews2.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);

    // Insert data from the temporary table into the main table with the date converted to a DATE type
    await client.query(`INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      SELECT id, product_id, rating, to_timestamp(date), summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
      FROM temp_reviews;`);

    // Drop the temporary table
    await client.query(`DROP TABLE temp_reviews;`);

    console.log('Data successfully copied!');
  } catch (err) {
    console.error('Error copying data:', err);
  } finally {
    await client.end();
  }
}

copyData();
