const { Pool } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

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

fs.createReadStream('/Volumes/Seagate Drive/HR-Senior/SDC/SDC-ReviewsAPI/ReviewsAPI/data/characteristics2.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Transform the data here as needed
    const transformedData = {
      id: data.id,
      product_id: data.product_id,
      name: data.name,
    };

    results.push(transformedData);
  })
  .on('end', () => {
    //Load the data into PostgreSQL

    console.log('results', results)
    const query = `
      INSERT INTO test (id, product_id, name)
      VALUES
        ${results.map((data) => `(${data.id}, ${data.product_id}, '${data.name}')`).join(',')}
    `;

    pool.query(query, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Data successfully loaded into PostgreSQL');
      pool.end();
    });
  });
