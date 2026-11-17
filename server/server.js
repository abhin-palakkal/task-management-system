require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const db = require('./db');
const cors = require('cors');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log(
    chalk.yellow(`app is running @http://localhost:${process.env.PORT}`)
  );
});
