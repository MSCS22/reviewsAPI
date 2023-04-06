const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "reviewstest",
  password: "MSPG95",
  port: 5432,
});

async function copyData() {
  try {
    await client.connect();
    console.log('Successfully connected to the database!');

    // Copy data from characteristics.csv
    const characteristicsStream = fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv');
    await client.query("COPY characteristics (product_id, name) FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')");
    characteristicsStream.pipe(client.query.copyFrom);

    // Copy data from characteristic_reviews.csv
    const characteristicReviewsStream = fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv');
    await client.query("COPY characteristic_reviews (characteristic_id, review_id, value) FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')");
    characteristicReviewsStream.pipe(client.query.copyFrom);

    // Copy data from reviews_photos.csv
    const reviewsPhotosStream = fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv');
    await client.query("COPY reviews_photos (review_id, url) FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')");
    reviewsPhotosStream.pipe(client.query.copyFrom);

    console.log('Data successfully copied!');
  } catch (err) {
    console.error('Error copying data:', err);
  } finally {
    await client.end();
  }
}

copyData();



// -- psql -U postgres -d reviewsdb -c "\copy characteristics FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"


// -- psql -U postgres -d reviewsdb -c "\copy characteristic_reviews FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy reviews_photos FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv' DELIMITER ',' CSV HEADER"
