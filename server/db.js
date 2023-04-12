const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "reviewsdb",
  password: "MSPG95",
  port: 5432,
});


 //client.connect();


module.exports = pool;

// -- psql -U postgres -d reviewsdb -c "\copy characteristics FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy test FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy characteristic_reviews FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER"

// -- psql -U postgres -d reviewsdb -c "\copy reviews_photos FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv' DELIMITER ',' CSV HEADER"
