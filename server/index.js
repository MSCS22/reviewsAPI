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

app.get("/loaderio-d07120ba7a9e99cf54edf563521476bc", (req, res) => res.send("loaderio-d07120ba7a9e99cf54edf563521476bc"))

