const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(chalk.yellow('DB CONNECTED'));
  })
  .catch(e => {
    console.log(e);
  });

module.exports = mongoose;
