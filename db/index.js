const { Pool, Client } = require('pg')
require('dotenv/config');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sn',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params,callback)
  },
  client: () => {
    return pool.connect()
  }
}