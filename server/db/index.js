const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose
  .connect('mongodb://localhost:27017/TMSDB')
  .then(() => {
    console.log(chalk.yellow('DB CONNECTED'));
  })
  .catch(e => {
    console.log(e);
  });

module.exports = mongoose;
