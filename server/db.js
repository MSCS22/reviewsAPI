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

    // Copy data from reviews.csv
    // await client.query(`COPY reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) FROM '/Users/majdsaleh/2302/reviews2.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);
    await client.query(`COPY test (id,product_id,name) FROM '/Users/majdsaleh/2302/characteristics2.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);


    // Copy data from characteristics.csv
    //const characteristicsStream = fs.createReadStream('./data/characteristics2.csv');
    // const somePath = path.join(__dirname, '../data/characteristics2.csv')
    await client.query(`COPY characteristics (id,product_id,name) FROM '/Users/majdsaleh/2302/characteristics.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);
    //characteristicsStream.pipe(client.query.copyFrom);

    // // // Copy data from characteristic_reviews.csv
    // const characteristicReviewsStream = fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv');
    // await client.query("COPY characteristic_reviews (characteristic_id, review_id, value) FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')");
    // characteristicReviewsStream.pipe(client.query.copyFrom);
    await client.query(`COPY characteristic_reviews (id,product_id,name) FROM '/Users/majdsaleh/2302/characteristic_reviews.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);
    // // Copy data from reviews_photos.csv
    // const reviewsPhotosStream = fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv');
    // await client.query("COPY reviews_photos (review_id, url) FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')");
    // reviewsPhotosStream.pipe(client.query.copyFrom);
    await client.query(`COPY reviews_photos (id,product_id,name) FROM '/Users/majdsaleh/2302/reviews_photos.csv.csv' WITH (FORMAT CSV, HEADER true, DELIMITER ',')`);


    console.log('Data successfully copied!');
  } catch (err) {
    console.error('Error copying data:', err);
  } finally {
    await client.end();
  }
}

copyData();



// -- psql -U postgres -d reviewsdb -c "\copy characteristics FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy test FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy characteristic_reviews FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy reviews_photos FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv' DELIMITER ',' CSV HEADER"
