const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const routes = require('./routes');


const app = express();
const port = process.env.PORT || 3000;

app.use('/reviews', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});