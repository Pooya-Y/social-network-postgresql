const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sn',
  password: 'pooya67206720',
  port: 5432,
})


module.exports = {
  query: (text, params) => {
    return pool.query(text, params)
  }
}