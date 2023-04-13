require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});




module.exports = pool;
