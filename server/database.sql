CREATE DATABASE reviewsdb;


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
CREATE INDEX id_reviews_review_id
ON reviews(review_id);
CREATE INDEX id_reviews_product_id
ON reviews(product_id);


CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url TEXT
);
CREATE INDEX id_reviews_photos_review_id
ON reviews_photos(review_id);


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

CREATE INDEX idx_characteristics_product_id ON characteristics (product_id);

CREATE INDEX idx_characteristic_reviews_characteristic_id ON characteristic_reviews (characteristic_id);


-- psql -U postgres -d reviewsdb -c "\copy characteristics FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics.csv' DELIMITER ',' CSV HEADER"


-- psql -U postgres -d reviewsdb -c "\copy characteristic_reviews FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristic_reviews.csv' DELIMITER ',' CSV

-- psql -U postgres -d reviewsdb -c "\copy reviews_photos FROM '/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/reviews_photos.csv' DELIMITER ',' CSV HEADER"

