const pgp = require('pg-promise')()
const MongoClient = require('mongodb').MongoClient

exports.core = async (tenant_id) => {
  const db = this.postgress({
    database_config: {
      username: 'postgres',
      password: 'eunt3ukj1hk3',
      host: '127.0.0.1',
      port: '5432',
      database: 'core',
    }
  })
  return db.one('SELECT * from tenants where id = $1', tenant_id)
    .then((data) => data)
    .catch((error) => {
      throw error;
    })
}

exports.postgress = (config) => {
  pgp.end();
  return pgp(`postgres://${config.database_config.username}:${config.database_config.password}@${config.database_config.host}:${config.database_config.port}/${config.database_config.database}`)
}

exports.mongo = async (config) => {
  const url = `mongodb+srv://${config.database_config.username}:${config.database_config.password}@${config.database_config.host}`;
  const client = new MongoClient(url);
  await client.connect();
  return client.db(config.id);
}

