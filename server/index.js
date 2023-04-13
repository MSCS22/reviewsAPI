const express = require('express');
const pg = require('pg');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/reviews', routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/loaderio-3939ab9edb5cfb19b55f848e58211efa", (req, res) => res.send("loaderio-3939ab9edb5cfb19b55f848e58211efa"))

