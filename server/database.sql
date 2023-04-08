CREATE DATABASE reviewsTEST;


CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date DATE NOT NULL,
  summary VARCHAR(255),
  body TEXT,
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(100),
  reviewer_email VARCHAR(255),
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);


CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url TEXT
);

CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value FLOAT NOT NULL
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NULL
);
-- psql -U postgres -d reviewsdb -c "\copy characteristics FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"


-- psql -U postgres -d reviewsdb -c "\copy characteristic_reviews FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv' DELIMITER ',' CSV

-- psql -U postgres -d reviewsdb -c "\copy reviews_photos FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv' DELIMITER ',' CSV HEADER"

