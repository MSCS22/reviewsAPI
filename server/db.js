require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');


// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

const pool = new Pool({
  user:"postgres",
  host: "18.188.125.26",
  database: "reviewsDB",
  password: "SDCPG95",
  port: 5432,
});


module.exports = pool;
