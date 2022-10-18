const express = require('express')
const app = express()
const port = 3000
const driver = require("./helpers/database");

const connection = { type: null, db: null };

app.use(async (req, res, next) => {
  const getTenant = await driver.core(req.headers.authorization);
  connection.type = getTenant.database_config.connection;

  if (getTenant.database_config.connection === 'pgsql') {
    connection.db = driver.postgress(getTenant);
  } else {
    connection.db = await driver.mongo(getTenant);
  }
  
  next();
});

app.get('/', async (req, res) => {
  let users = [];

  if (connection.type === 'pgsql') {
    users = await connection.db.any('SELECT * from users');
  } else {
    users = await connection.db.collection('users').find().toArray();
  }

  res.json(users)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})