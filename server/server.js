require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const db = require('./db');

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(
    chalk.yellow(`app is running @http://localhost:${process.env.PORT}`)
  );
});
